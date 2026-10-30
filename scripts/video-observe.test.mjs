import test from 'node:test';import assert from 'node:assert/strict';import {slug,timestamps,mediaFiles} from './video-observe.mjs';
test('tres timecodes reproducibles',()=>assert.deepEqual(timestamps(10),[1,5,9]));
test('video corto no pide frames negativos',()=>assert.deepEqual(timestamps(.01),[0,0,0]));
test('duración inválida no pasa',()=>assert.throws(()=>timestamps(0),/inválida/));
test('no traversal ni nombres extraños',()=>{for(const x of ['../etc','A B','a/b','.hidden'])assert.throws(()=>slug(x))});
test('excluye playlists, carpetas y archivos no multimedia',()=>{const x=[{name:'a.MOV',isFile:()=>true},{name:'b.m3u8',isFile:()=>true},{name:'clip.mp4',isFile:()=>false}];assert.deepEqual(mediaFiles(x),['a.MOV'])});

import {coverageTimestamps,framePrefix,storyboardMarkdown} from './video-observe.mjs';
test('storyboard distribuido captura más de tres fotogramas',()=>{const a=coverageTimestamps(10);assert.equal(a.length,7);assert.ok(a[0]>=0);assert.ok(a.at(-1)<10)});
test('tamaño de storyboard limitado',()=>{assert.equal(coverageTimestamps(60).length,18);assert.equal(coverageTimestamps(60,8).length,8)});
test('clips ultracortos no generan tiempos negativos',()=>assert.deepEqual(coverageTimestamps(.01),[0]));
test('configuración abusiva bloqueada',()=>assert.throws(()=>coverageTimestamps(20,250),/maxFrames/));
test('nombres equivalentes normalizados reciben distinto hash',()=>assert.notEqual(framePrefix('café.mov'),framePrefix('caf_.mov')));
test('markdown no afirma visión e incluye rutas codificadas',()=>{const m=storyboardMarkdown({files:[{source:'clip [1].MOV',duration_seconds:10,frames:[{time_seconds:2.5,file:'a-01.jpg'}]}]});assert.match(m,/NO comprensión semántica/);assert.match(m,/clip%20%5B1%5D.MOV/);assert.match(m,/a-01.jpg/) });
