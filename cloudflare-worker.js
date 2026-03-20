import { DurableObject } from 'cloudflare:workers';
import { COUNTER_STYLES, normalizeCounterOptions, renderCounterSvg } from './js/modern-counter-styles.js';

const COUNTER_IMAGE_ROUTE = /^\/c\/([a-z0-9][a-z0-9._-]{0,63})\.svg$/i;
const COUNTER_JSON_ROUTE = /^\/api\/counters\/([a-z0-9][a-z0-9._-]{0,63})$/i;

function parseStartValue(url) {
  const value = url.searchParams.get('start') || url.searchParams.get('initial') || '0';
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0;
  }

  return Math.min(parsed, 999999999999);
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'access-control-allow-origin': '*',
      'x-robots-tag': 'noindex, nofollow'
    }
  });
}

function svgResponse(svg, cacheHeader) {
  return new Response(svg, {
    headers: {
      'content-type': 'image/svg+xml; charset=utf-8',
      'cache-control': cacheHeader,
      'x-robots-tag': 'noindex, nofollow, noimageindex'
    }
  });
}

async function getCounterCount(env, slug, startValue, increment) {
  const objectId = env.COUNTERS.idFromName(slug);
  const stub = env.COUNTERS.get(objectId);
  const actionUrl = new URL(`https://counter.internal/${increment ? 'increment' : 'value'}`);
  actionUrl.searchParams.set('start', String(startValue));
  const response = await stub.fetch(actionUrl.toString());

  if (!response.ok) {
    throw new Error(`Counter Durable Object returned ${response.status}`);
  }

  return response.json();
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return jsonResponse({ error: 'Method not allowed' }, 405);
    }

    if (url.pathname === '/health') {
      return jsonResponse({
        status: 'ok',
        service: 'contador-de-visitas',
        storage: 'durable-objects',
        styles: COUNTER_STYLES.map((style) => style.id)
      });
    }

    if (url.pathname === '/preview.svg') {
      const options = normalizeCounterOptions({
        style: url.searchParams.get('style'),
        theme: url.searchParams.get('theme'),
        digits: url.searchParams.get('digits'),
        label: url.searchParams.get('label'),
        count: url.searchParams.get('value')
      });

      return svgResponse(renderCounterSvg(options), 'public, max-age=3600');
    }

    if (url.pathname === '/api/styles') {
      return jsonResponse({
        styles: COUNTER_STYLES
      });
    }

    const imageMatch = url.pathname.match(COUNTER_IMAGE_ROUTE);
    if (imageMatch) {
      const slug = imageMatch[1].toLowerCase();
      const startValue = parseStartValue(url);
      const options = normalizeCounterOptions({
        slug,
        style: url.searchParams.get('style'),
        theme: url.searchParams.get('theme'),
        digits: url.searchParams.get('digits'),
        label: url.searchParams.get('label')
      });
      const data = await getCounterCount(env, slug, startValue, true);

      return svgResponse(
        renderCounterSvg({
          style: options.style,
          theme: options.theme,
          digits: options.digits,
          label: options.label,
          count: data.count
        }),
        'no-store, no-cache, must-revalidate'
      );
    }

    const jsonMatch = url.pathname.match(COUNTER_JSON_ROUTE);
    if (jsonMatch) {
      const slug = jsonMatch[1].toLowerCase();
      const data = await getCounterCount(env, slug, 0, false);

      return jsonResponse({
        id: slug,
        count: data.count,
        createdAt: data.createdAt ? new Date(data.createdAt).toISOString() : null,
        updatedAt: data.updatedAt ? new Date(data.updatedAt).toISOString() : null
      });
    }

    return jsonResponse({
      service: 'contador-de-visitas',
      endpoints: {
        counterSvg: '/c/:id.svg',
        previewSvg: '/preview.svg',
        counterJson: '/api/counters/:id',
        health: '/health'
      }
    });
  }
};

export class CounterDurableObject extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.ctx = ctx;
    this.record = null;
    this.loaded = false;
  }

  async loadRecord() {
    if (!this.loaded) {
      this.record = await this.ctx.storage.get('record');
      this.loaded = true;
    }

    return this.record;
  }

  async saveRecord(record) {
    this.record = record;
    this.loaded = true;
    await this.ctx.storage.put('record', record);
  }

  async fetch(request) {
    const url = new URL(request.url);
    const start = parseStartValue(url);
    const now = Date.now();
    let record = await this.loadRecord();

    if (url.pathname === '/increment') {
      if (!record) {
        record = {
          count: start,
          createdAt: now,
          updatedAt: now
        };
      }

      record.count += 1;
      record.updatedAt = now;
      await this.saveRecord(record);

      return jsonResponse(record);
    }

    if (url.pathname === '/value') {
      if (!record) {
        return jsonResponse({
          count: 0,
          createdAt: null,
          updatedAt: null
        });
      }

      return jsonResponse(record);
    }

    return jsonResponse({ error: 'Not found' }, 404);
  }
}
