<script lang="typescript" type="module">
	import { Embed } from '$lib/index';
	import * as syncitTransporter from '@syncit/transporter';

	new Embed({
		target: document.body,
		props: {
			createTransporter() {
				return new syncitTransporter.LocalStorageTransporter();
			}
		}
	});
</script>

<!-- Bootstrap core CSS -->
<link href="/embed.css" rel="stylesheet" />

<form class="form-signin">
	<img
		class="mb-4"
		src="https://getbootstrap.com/docs/4.0/assets/brand/bootstrap-solid.svg"
		alt=""
		width="72"
		height="72"
	/>
	<h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
	<label for="inputEmail" class="sr-only">Email address</label>
	<input type="email" id="inputEmail" class="form-control" placeholder="Email address" required />
	<label for="inputPassword" class="sr-only">Password</label>
	<input type="password" id="inputPassword" class="form-control" placeholder="Password" required />
	<div class="checkbox mb-3">
		<label>
			<input type="checkbox" value="remember-me" /> Remember me
		</label>
	</div>
	<button class="btn btn-lg btn-primary btn-block" type="submit"> Sign in </button>
	<p class="mt-5 mb-3 text-muted">&copy; 2017-2018</p>
</form>
