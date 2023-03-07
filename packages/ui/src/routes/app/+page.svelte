<script lang="typescript">
	import * as syncit from '$lib/index';
	import * as syncitTransporter from '@syncit/transporter';

	new syncit.App({
		target: document.body,
		props: {
			bufferMs: 100,
			createTransporter({ role, uid }) {
				return new syncitTransporter.LocalStorageTransporter();
			}
		}
	});
</script>
