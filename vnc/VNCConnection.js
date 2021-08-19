const rfb2 = require('rfb2');
const canvas = require('canvas');

module.exports = class VNCConnection {
	constructor(info) {
		this.info = info;
		this.conn = null;

		this.mouseAt = [ 0, 0, 0 ];

		this.canvas = canvas.createCanvas(1, 1);
		this.context = this.canvas.getContext('2d', { 'alpha': false });
	}

	connect() {
		const settings = {
			'host': this.info.ip,
			'port': this.info.port
		};

		if(this.info.auth) {
			settings.password = this.info.auth.password;
		}

		this.conn = rfb2.createConnection(settings);

		// TODO: refactor these events
		// for now I just wanna get them working
		this.conn.on('rect', (rect) => {
			// i have only implemented raw pixel blocks thus far
			// i should probably expand this, but eh
			if(rect.encoding !== rfb2.encodings.raw) return ;

			const data = new DataView(rect.data.buffer);
			for(let ix = 0; ix < rect.data.length; ix += 4) {
				// BGRA -> ARGB (flipped byte order)
				const val = data.getUint32(ix, false);
				// then rotate -> RGBA and set
				data.setUint32(ix, (val >>> 8) | (val << 24), true);
			}

			const imageData = this.context.createImageData(rect.width, rect.height);
			imageData.data.set(rect.data);

			this.context.putImageData(imageData, rect.x, rect.y);
		});

		this.conn.on('resize', () => {
			this.canvas.width = this.getWidth();
			this.canvas.height = this.getHeight();

			this.mouseMove();
		});

		this.conn.stream.on('end', () => {
			console.debug('[VNCConnection] Disconnected from ' + this.info.name);
			this.conn = null;
		});

		return new Promise((res, rej) => {
			this.conn.on('connect', () => {
				this.canvas.width = this.getWidth();
				this.canvas.height = this.getHeight();

				console.debug('[VNCConnection] Connected to ' + this.info.name);
				res();
			});

			this.conn.on('error', (er) => {
				rej(er);
			});
		});
	}

	isConnected() {
		return this.conn !== null;
	}

	getWidth() {
		return this.isConnected() ? this.conn.width : null;
	}

	getHeight() {
		return this.isConnected() ? this.conn.height : null;
	}

	getScreenshot() {
		return new Promise((res, rej) => {
			if(!this.isConnected()) {
				rej('This connection is currently inactive!');
				return ;
			}

			this.conn.once('rect', () => {
				res(this.canvas);
				return ;
			});

			this.conn.requestUpdate(
				false,
				0, 0,
				this.getWidth(),
				this.getHeight()
			);
		});
	}

	pressKey(key, state) {
		return new Promise((res, rej) => {
			if(!this.isConnected()) {
				rej('This connection is currently inactive!');
				return ;
			}

			// TODO: find correct way to await key press
			setTimeout(res, 25);
			this.conn.keyEvent(key, state);
		});
	}

	mouseMove(x = this.mouseAt[0], y = this.mouseAt[1]) {
		return new Promise((res, rej) => {
			if(!this.isConnected()) {
				rej('This connection is currently inactive!');
				return ;
			}

			// constrain location of mouse
			x = Math.min(x, this.canvas.width);
			x = Math.max(x, 0);

			y = Math.min(y, this.canvas.height);
			y = Math.max(y, 0);

			// update state array
			if(!Number.isNaN(x)) this.mouseAt[0] = x;
			if(!Number.isNaN(y)) this.mouseAt[1] = y;

			// TODO: find correct way to await mouse movement
			setTimeout(res, 25);
			this.conn.pointerEvent(...this.mouseAt);
		});
	}

	mouseMoveRelative(x = 0, y = 0) {
		return this.mouseMove(
			this.mouseAt[0] + x,
			this.mouseAt[1] + y
		);
	}

	mouseStateSet(state = this.mouseAt[2]) {
		return new Promise((res, rej) => {
			if(!this.isConnected()) {
				rej('This connection is currently inactive!');
				return ;
			}

			this.mouseAt[2] = state;

			// TODO: find correct way to await mouse movement
			setTimeout(res, 25);
			this.conn.pointerEvent(...this.mouseAt);
		});
	}
};