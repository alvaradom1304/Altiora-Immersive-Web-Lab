import test from 'node:test';import assert from 'node:assert/strict';import {slug,timestamps,mediaFiles} from './video-observe.mjs';
test('tres timecodes reproducibles',()=>assert.deepEqual(timestamps(10),[1,5,9]));
test('video corto no pide frames negativos',()=>assert.deepEqual(timestamps(.01),[0,0,0]));
test('duración inválida no pasa',()=>assert.throws(()=>timestamps(0),/inválida/));
test('no traversal ni nombres extraños',()=>{for(const x of ['../etc','A B','a/b','.hidden'])assert.throws(()=>slug(x))});
test('excluye playlists, carpetas y archivos no multimedia',()=>{const x=[{name:'a.MOV',isFile:()=>true},{name:'b.m3u8',isFile:()=>true},{name:'clip.mp4',isFile:()=>false}];assert.deepEqual(mediaFiles(x),['a.MOV'])});
