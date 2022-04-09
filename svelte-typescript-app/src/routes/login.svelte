<script>
	import { onDestroy } from 'svelte';
	import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Form,
    Button,
    Label,
    Input,
     Modal,
    ModalBody,
    ModalFooter,
    ModalHeader
  } from 'sveltestrap';


  import { Styles } from 'sveltestrap';
  import  '../assets/login.css'
  import { useNavigate, useLocation } from "svelte-navigator";
  import { user, isAuthenticated, token } from "../lib/store";
	import { onMount } from "svelte";


  const navigate = useNavigate();
  const location = useLocation();

  let email;
  let password;

  let auth = false;
  isAuthenticated.subscribe(a=> auth = a);
  
  let open = false;
  let err = '';
  const toggle = () => (open = !open);
  let check = true;

  async function handleSubmit() {
      event.preventDefault();
      const res = await fetch('http://localhost:5000/api/users/auth', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            "email": email,
            "password": password
        }),
      });

      if(res.status===200) {
        const auth = await res.json();
        if(auth.success==true){
            $isAuthenticated = true;
            $user = auth.data.data;
            $token = auth.token;

            localStorage.setItem("user", $user);
            localStorage.setItem("token",  $token);
            const from = ($location.state && $location.state.from) || "/";
            navigate(from, { replace: true });
            open = false;
            err = '';
            return;
        } else {
            $isAuthenticated = false;
            $user = {
                    id: null,
                    first_name: null,
                    last_name: null,
                    role: null
                };
           err = res.err;
           open = true;
           return;
        }
        
      } else {
        $isAuthenticated = false;
        $user = {
			id: null,
			first_name: null,
			last_name: null,
			role: null
		};
          err = res.err;
           open = true;
           return;
      }
    
  }

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
                    navigate("/", {
                    state: { from: $location.pathname },
                    replace: true,
                    });
                    return;
                }  else {
                    check = false;
                }
                
            } else {
            check = false;
        }	  
        

        } else {
            check = false;
        }
		
    });

$: if (auth) {
    navigate("/home", {
      state: { from: $location.pathname },
      replace: true,
    });
  }



</script>

<Styles />

{#if auth === false && check === false}

<main class="form-login">
    <h3 class="h3 mb-3 fw-normal">Please sign in</h3>
    <Form on:submit={handleSubmit}>
        <div class="form-floating">
            <div class="mb-3" controlId="formBasicEmail">
                <Label>Email address</Label>
                <Input bind:value={email} type="email" placeholder="Enter email" class="form-control" autocomplete="email" />
                <p class="text-muted">We'll never share your email with anyone else.</p>
            </div>
        </div>
        <div class="form-floating">
            <div class="mb-3" controlId="formBasicPassword">
                <Label>Password</Label>
                <Input bind:value={password} type="password" placeholder="Password" autocomplete="current-password" />
            </div>
        </div>
        <div class="alert alert-danger" role="alert">
            email: admin@admin.com <br />
            password: 123456789 <br />
            <h6>remove this before production</h6>
        </div>

        <Button variant="primary" type="submit" class="w-100 btn btn-lg btn-primary">
            Sign in
        </Button>
    </Form>
    <p class="mt-5 mb-3 text-muted center">
        <a href="https://github.com/TarekElBarody">Tarek El-Barody</a> &copy; 2022
    </p>
</main>

<Modal isOpen={open} backdrop={false} {toggle}>
    <ModalHeader {toggle}>Error Authincation</ModalHeader>
    <ModalBody>
      {err}
    </ModalBody>
    <ModalFooter>
      <Button color="primary" on:click={toggle}>OK</Button>
    </ModalFooter>
  </Modal>
 {:else}
	 <p>loading..</p>
  {/if}