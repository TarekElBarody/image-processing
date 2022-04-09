<script>
	import { Router, Route, Link } from "svelte-navigator";
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
    DropdownItem
  } from 'sveltestrap';

  import { Styles } from 'sveltestrap';

	
</script>

<Styles />
<header>
  <h1>History</h1>

  <nav>
  <Link to="/">Home</Link>
  <Link to="about">About</Link>
  <Link to="profile">Profile</Link>
  </nav>
</header>
