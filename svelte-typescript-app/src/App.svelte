<script>
	import { Router, Route, Link } from "svelte-navigator";
	import Login from "./routes/login.svelte";
	import Home from "./routes/home.svelte";
	import TopNave from "./components/topNav.svelte";
  import { useNavigate, useLocation } from "svelte-navigator";
	import { user, isAuthenticated, token } from "./lib/store";

	import PrivateRoute from "./routes/PrivateRoute.svelte";
	import { onMount } from "svelte";
  
	let auth = false;
	isAuthenticated.subscribe(a=> auth = a);

	function handleLogout() {
		$token='';
	 $isAuthenticated = false;
        $user = {
			id: null,
			first_name: null,
			last_name: null,
			role: null
		};
    	localStorage.setItem("token", $token);
	};

	
	  
	
  </script>
  
  <Router> 
	<main class="wrap">
		{#if auth === false}
		  <Route path="login">
		<Login />
	  </Route>
	  {:else}
	  <TopNave/>
		{/if}
	
  
	  <PrivateRoute path="/">
		<Home/>
	  </PrivateRoute>

	  <PrivateRoute path="/home">
		<Home/>
	  </PrivateRoute>
  
	  <PrivateRoute path="/about">
		<h3>About</h3>
		<p>That's what it's all about!</p>
	  </PrivateRoute>
  
	  <PrivateRoute path="/profile" let:location>
		<h3>Welcome {$user.first_name}</h3>
		<button on:click={handleLogout}>Logout</button>
	  </PrivateRoute>

	  <Route>
		  <h3>404 Not Found!</h3>
	  </Route>
	</main>
  </Router>
  
  {#if auth == true}
		<style>
			body {
				background: #f5f5f5;
			}
		</style>
		 
	  {:else}
	  <style>
		body{
			background: #fff;
		}
	</style>
		{/if}

  <style>
	  .wrap{width: 100%;}
  </style>