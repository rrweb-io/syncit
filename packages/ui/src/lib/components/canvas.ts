import Konva from 'konva';
import { CustomEventTags } from '@syncit/core';

export default function createCanvas({
	width,
	height,
	role,
	stroke,
	strokeWidth,
	mode,
	record
}: {
	width: number;
	height: number;
	role: string;
	stroke: string;
	strokeWidth: number;
	mode: string;
	record: any;
}) {
	class Canvas {
		stage: Konva.Stage;
		layer: Konva.Layer;
		isPainting: boolean;
		lastLine: Konva.Line | null = null;

		constructor({ width, height }: { width: number; height: number }) {
			this.stage = new Konva.Stage({
				container: 'syncit-canvas',
				width,
				height
			});

			this.layer = new Konva.Layer();
			this.stage.add(this.layer);

			this.isPainting = false;
		}

		startLine() {
			this.isPainting = true;
			const pos = this.stage.getPointerPosition();
			this.lastLine = new Konva.Line({
				stroke,
				strokeWidth,
				globalCompositeOperation: mode === 'brush' ? 'source-over' : 'destination-out',
				points: pos ? [pos.x, pos.y] : [0, 0]
			});
			this.layer.add(this.lastLine);

			if (role === 'master') {
				record.addCustomEvent(CustomEventTags.StartLine, undefined);
			}
		}

		endLine() {
			this.isPainting = false;

			if (role === 'master') {
				record.addCustomEvent(CustomEventTags.EndLine, undefined);
			}
		}

		draw() {
			if (!this.isPainting) {
				return;
			}

			const pos = this.stage.getPointerPosition();
			if (!pos || !this.lastLine) return;

			const newPoints = this.lastLine.points().concat([pos.x, pos.y]);
			this.drawPoints(newPoints);

			if (role === 'master') {
				record.addCustomEvent(CustomEventTags.DrawLine, { points: newPoints });
			}
		}

		drawPoints(points: Array<number>) {
			if (!this.lastLine) return;
			this.lastLine.points(points);
			this.layer.batchDraw();
		}
	}
	return new Canvas({ width, height });
}
