## Login and Route Permission (Advanced)

Let's delve into the login and route permission logic of Vue3-Admin-Plus in detail.

### Login Logic

In the `login.vue` page, clicking the login button triggers the `handleLogin` method:

```vue
<template>
  <el-button @click.prevent="handleLogin">Login</el-button>
</template>

<script setup>
import { ref } from 'vue';
import { loginReq } from '@/api/user';
import { useBasicStore } from '@/store/basic';
import { useRouter } from 'vue-router';

const refLoginForm = ref(null);
const subLoading = ref(false);
const subForm = ref({
  username: '',
  password: ''
});

const handleLogin = () => {
  refLoginForm.value.validate((valid) => {
    subLoading.value = true;
    if (valid) loginFunc();
  });
}

const loginFunc = () => {
  loginReq(subForm.value)
    .then(({ data }) => {
      elMessage('Login successful');
      const basicStore = useBasicStore();
      basicStore.setToken(data?.jwtToken);
      const router = useRouter();
      router.push('/');
    })
}
</script>
```

The `handleLogin` method validates the login form and triggers the `loginFunc` if the form is valid. The `loginFunc` sends a login request, sets the token in the store, and redirects the user to the home page upon successful login.

### Permission Logic

The permission logic involves intercepting route navigation to ensure authentication and authorization. Here's an overview:

- **Before Each Route Navigation**: Intercept route navigation using `router.beforeEach` to check if the user is authenticated and has the necessary permissions to access the route.

- **After Each Route Navigation**: Perform cleanup or additional actions after each route navigation using `router.afterEach`.

```javascript
import { useRouter } from 'vue-router';
import { useBasicStore } from '@/store/basic';
import { progressStart, progressClose } from '@/utils/loading';
import { userInfoReq } from '@/api/user';
import { settings } from '@/settings';

const router = useRouter();
const whiteList = ['/login', '/404', '/401']; // List of routes that do not require authentication

router.beforeEach(async (to) => {
  progressStart();
  document.title = langTitle(to.meta?.title); // Set page title, supporting internationalization

  const basicStore = useBasicStore();

  if (!settings.isNeedLogin) {
    basicStore.setFilterAsyncRoutes([]);
    return true;
  }

  if (basicStore.token) {
    if (to.path === '/login') {
      return '/';
    } else {
      if (!basicStore.getUserInfo) {
        try {
          const userData = await userInfoReq();
          filterAsyncRouter(userData);
          basicStore.setUserInfo(userData);
          return { ...to, replace: true };
        } catch (e) {
          console.error(`Route permission error: ${e}`);
          basicStore.resetState();
          progressClose();
          return `/login?redirect=${to.path}`;
        }
      } else {
        return true;
      }
    }
  } else {
    if (!whiteList.includes(to.path)) {
      return `/login?redirect=${to.path}`;
    } else {
      return true;
    }
  }
});

router.afterEach(() => {
  progressClose();
});
```

This logic ensures that users are redirected to the login page if they are not authenticated or if they try to access a route that requires authentication. Additionally, it fetches user information and filters dynamic routes based on permissions.

### Menu Filtering

Menu filtering involves filtering routes based on user roles or permission codes, as well as generating dynamic menus.

#### Filtering by Roles or Permission Codes

```javascript
export function filterAsyncRoutesByRoles(routes, roles) {
  const res = [];
  routes.forEach((route) => {
    const tmp = { ...route };
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutesByRoles(tmp.children, roles);
      }
      res.push(tmp);
    }
  });
  return res;
}

function hasPermission(roles, route) {
  if (route?.meta?.roles) {
    return roles?.some((role) => route.meta.roles.includes(role));
  } else {
    return true;
  }
}
```

#### Dynamic Menu Generation

```javascript
const buttonCodes = []; // Button permissions

export const filterAsyncRoutesByMenuList = (menuList) => {
  const filterRouter = [];
  menuList.forEach((route) => {
    if (route.category === 3) {
      buttonCodes.push(route.code);
    } else {
      const itemFromReqRouter = getRouteItemFromReqRouter(route);
      if (route.children?.length) {
        itemFromReqRouter.children = filterAsyncRoutesByMenuList(route.children);
      }
      filterRouter.push(itemFromReqRouter);
    }
  });
  return filterRouter;
}

const getRouteItemFromReqRouter = (route) => {
  const tmp = { meta: { title: '' } };
  const routeKeyArr = ['path', 'component', 'redirect', 'alwaysShow', 'name', 'hidden'];
  const metaKeyArr = ['title', 'activeMenu', 'elSvgIcon', 'icon'];
  const modules = import.meta.glob('../views/**/**.vue');

  routeKeyArr.forEach((fItem) => {
    if (fItem === 'component') {
      if (route[fItem] === 'Layout') {
        tmp[fItem] = Layout;
      } else {
        tmp[fItem] = modules[`../views/${route[fItem]}`];
      }
    } else if (

fItem === 'path' && route.parentId === 0) {
      tmp[fItem] = `/${route[fItem]}`;
    } else if (['hidden', 'alwaysShow'].includes(fItem)) {
      tmp[fItem] = !!route[fItem];
    } else if (['name'].includes(fItem)) {
      tmp[fItem] = route['code'];
    } else if (route[fItem]) {
      tmp[fItem] = route[fItem];
    }
  });

  metaKeyArr.forEach((fItem) => {
    if (route[fItem] && tmp.meta) tmp.meta[fItem] = route[fItem];
  });

  if (route.extra) {
    Object.entries(route.extra.parse(route.extra)).forEach(([key, value]) => {
      if (key === 'meta' && tmp.meta) {
        tmp.meta[key] = value;
      } else {
        tmp[key] = value;
      }
    });
  }

  return tmp;
}
```

This logic filters routes based on user roles or permission codes and generates dynamic menus accordingly.
