<script lang="ts">
	import Konva from 'konva';
	import { onMount } from 'svelte';
	import { record } from 'rrweb';
	import { CustomEventTags } from '@syncit/core';

	export let role = 'master';
	export let mode: string;
	$: lineMode = ['brush', 'eraser'].includes(mode);
	export let stroke: string;
	export let strokeWidth: number;

	let stage: Konva.Stage;
	let layer: Konva.Layer;
	let isPainting: boolean;
	let lastLine: Konva.Line | null = null;

	class Canvas {
		constructor({ width, height }: { width: number; height: number }) {
			stage = new Konva.Stage({
				container: 'syncit-canvas',
				width,
				height
			});

			layer = new Konva.Layer();
			stage.add(layer);

			isPainting = false;
		}

		startLine() {
			isPainting = true;
			const pos = stage.getPointerPosition();
			lastLine = new Konva.Line({
				stroke,
				strokeWidth,
				globalCompositeOperation: mode === 'brush' ? 'source-over' : 'destination-out',
				points: pos ? [pos.x, pos.y] : [0, 0]
			});
			layer.add(lastLine);

			if (role === 'master') {
				record.addCustomEvent(CustomEventTags.StartLine, undefined);
			}
		}

		endLine() {
			isPainting = false;

			if (role === 'master') {
				record.addCustomEvent(CustomEventTags.EndLine, undefined);
			}
		}

		draw() {
			if (!isPainting) {
				return;
			}

			const pos = stage.getPointerPosition();
			if (!pos || !lastLine) return;

			const newPoints = lastLine.points().concat([pos.x, pos.y]);
			this.drawPoints(newPoints);

			if (role === 'master') {
				record.addCustomEvent(CustomEventTags.DrawLine, { points: newPoints });
			}
		}

		drawPoints(points: Array<number>) {
			if (!lastLine) return;
			lastLine.points(points);
			layer.batchDraw();
		}
	}

	let canvas: Canvas;
	let ref: HTMLElement;

	export function startLine() {
		canvas.startLine();
	}
	export function endLine() {
		canvas.endLine();
	}
	export function setPoints(points: number[]) {
		canvas.drawPoints(points);
	}

	export function highlight(left: number, top: number) {
		let highlightEl = document.createElement('div');
		Object.assign(highlightEl.style, {
			position: 'absolute',
			left: `${left}px`,
			top: `${top}px`,
			background: stroke,
			width: `${2 * strokeWidth}px`,
			height: `${2 * strokeWidth}px`,
			borderRadius: `${strokeWidth}px`,
			animation: 'syncit-highlight 1000ms ease-out'
		});
		ref.appendChild(highlightEl);
		setTimeout(() => {
			if (ref.contains(highlightEl)) {
				ref.removeChild(highlightEl);
			}
		}, 1000);

		if (role === 'master') {
			record.addCustomEvent(CustomEventTags.Highlight, { left, top });
		}
	}

	onMount(() => {
		canvas = new Canvas(ref.getBoundingClientRect());

		if (role === 'master') {
			stage.on('mousedown touchstart', function (e) {
				if (lineMode) {
					canvas.startLine();
					return;
				}
				if (mode === 'highlight') {
					highlight(e.evt.clientX - strokeWidth, e.evt.clientY - strokeWidth);
				}
			});

			stage.on('mouseup touchend', function () {
				if (!lineMode) {
					return;
				}
				canvas.endLine();
			});

			stage.on('mousemove touchmove', function () {
				if (!lineMode) {
					return;
				}
				canvas.draw();
			});
		}
	});
</script>

<div id="syncit-canvas" bind:this={ref} />

<style>
	#syncit-canvas {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
	}

	@keyframes -global-syncit-highlight {
		0% {
			transform: scale(1);
			opacity: 0.5;
		}
		75% {
			transform: scale(1.5);
			opacity: 1;
		}
		100% {
			transform: scale(1);
			opacity: 0.5;
		}
	}
</style>
