<script>
  import { useNavigate, useLocation } from "svelte-navigator";
  import { user, isAuthenticated, token } from "../lib/store";
	import { onMount } from "svelte";

  let auth = false;
	isAuthenticated.subscribe(a=> auth = a);
  
  const navigate = useNavigate();
  const location = useLocation();

  onMount(async()=>{
    $token = localStorage.getItem('token');
    $user = localStorage.getItem('user');
    if($isAuthenticated===false && $token){
		    
		    const res = await fetch('http://localhost:5000/api/users/check', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "token": $token
            })
        });

        if(res.status===200) {
            const auth = await res.json();
            if(auth.success==true && auth.token==$token){
                $isAuthenticated = true;
                return;
            } else {
                $isAuthenticated = false;
                 $user = {
                    id: null,
                    first_name: null,
                    last_name: null,
                    role: null
                };
                navigate("/login", {
                  state: { from: $location.pathname },
                  replace: true,
                });
              
            }
            
        } else {
                $isAuthenticated = false;
                 $user = {
                    id: null,
                    first_name: null,
                    last_name: null,
                    role: null
                };
               navigate("/login", {
                  state: { from: $location.pathname },
                  replace: true,
                });
        }
	  
       

    }
		
});

 $: if (!auth) {
    navigate("/login", {
      state: { from: $location.pathname },
      replace: true,
    });
  }
</script>

{#if auth}
  <slot />
  {:else}
	 <p>loading..</p>
{/if}
