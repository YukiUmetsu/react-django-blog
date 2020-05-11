# react-django-blog
This is a blog project with react.js/next.js frontend, django backend, powered by linux, nginx, gunicorn, redis in docker containers.

# Technology stack
Frontend: Next.js (React.js) - server Node.js\
Backend: Django (python framework)\
Cache system: Redis\
Web server: Nginx\
WSGI (Web Server Getaway Interface): Gunicorn\
Database: postgresql

# initialize docker containers
<code>docker-compose up</code>\
<code>docker-compose up -d</code> (runs in background)

# access in web browser
access to localhost:5555

# Nginx config
access to /api/ or /admin/  => django application\
access to everything else   => Next.js application\
/static/ => specified static folder\
/media/ => specified media folder (user uploaded media)

# .env file
frontend: create a .env.dev file in frontend folder according to .env.sample.\
backend: create a .env.dev file in backend folder according to .env.sample.

# tips using pytest
1. add <code>DJANGO_SETTINGS_MODULE=blog.settings</code> in your .env file.<br>
2. Do NOT add "__init__.py" file under test folder. Otherwise, pytest can't find modules for some reason.<br>
3. start pytest<br>
<code>docker container exec -it backend sh -c "pytest"</code><br>
<code>pytest -v (verbose, show more detail)</code>

# loading initial data
1. if "backend/countries/fixtures/countries_fixtures.json" doesn't exist, do the following:<br>
<code>docker container exec -it backend sh -c "python countries_data_convert.py"</code><br>
this will create the countries_fixtures.json file.<br>
2. load the data from the json file<br>
<code> docker container exec -it backend sh -c "python manage.py loaddata countries/fixtures/countries_fixtures.json"</code><br>
** load all the initial data at once**
<code>docker container exec -it backend sh -c "python3 manage.py loaddata */fixtures/*.json"</code>

# create superuser
I created a script to create a super user in one command. <br>
Edit email and password in backend/scripts/add_superuser.py<br>
<code>docker container exec -it backend sh -c "python manage.py runscript add_superuser"</code>

# reset migrations
I created a script reset migrations in dev environment.<br>
1. drop the database.<br>
2. remove all the migration files.<br>
3. make new migration files and migrate again.<br>
<code>docker container exec -it backend sh -c "python manage.py runscript reset_migrate"</code> or <br>
<code>docker container exec -it backend sh -c "python cmanage.py resetmigrate"</code>

# shortcuts for creating a new app!
<code>docker container exec -it backend sh -c "python cmanage.py startapp app_name singular_app_name"</code><br>
*singular_app_name is optional<br>
This command creates a folder and scripts including default models ...etc like always but also.. <br>
basic serializers.py, test file in tests folder, urls.py, add basic model views script in views.py<br>
It also adds the app in the INSTALLED_APPS in the settings.py!!<br>

# commands to create basic serializers.py, urls.py, add basic api scripts to views.py
<code>docker container exec -it backend sh -c "python manage.py runscript add_api --script-args app_name singular_app_name"</code><br>
*singular_app_name is optional. If it is empty, singular will be app_name without last plural "s" if any.<br>

# Redis cache:
You should consider caching the result of a request when the following cases are true:<br>
- rendering the page involves a lot of database queries and/or business logic,<br>
- the page is visited frequently by your users,<br>
- the data is the same for every user,<br>
- and the data does not change often.<br>
<code>CACHE_TTL = getattr(settings, 'CACHE_TTL', DEFAULT_TIMEOUT)<br>@cache_page(CACHE_TTL)<br>def get_posts():</code>


# React UI Components
1. Image sliders
Example of using Image slider component.
```html
<ImageSliderManager>
    <ImageSliderItem image="/images/header/odaiba.jpg">
        <h1 className="text-white font-semibold text-5xl">
            Pick up Japanese with <b className="text-red-600">Jp</b>launch.
        </h1>
        <p className="mt-4 text-lg text-gray-300">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Vivamus nec finibus nisl. Mauris quis erat vitae tellus venenatis lobortis.
        </p>
    </ImageSliderItem>
    <ImageSliderItem image="/images/header/fuji.jpg">
        <h1 className="text-white font-semibold text-5xl">
            Pick up Japanese with <b className="text-red-600">Jp</b>launch.
        </h1>
        <p className="mt-4 text-lg text-gray-300">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Vivamus nec finibus nisl. Mauris quis erat vitae tellus venenatis lobortis.
        </p>
    </ImageSliderItem>
    <ImageSliderItem image="/images/header/shibuya.jpg">
        <h1 className="text-white font-semibold text-5xl">
            Pick up Japanese with <b className="text-red-600">Jp</b>launch.
        </h1>
        <p className="mt-4 text-lg text-gray-300">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Vivamus nec finibus nisl. Mauris quis erat vitae tellus venenatis lobortis.
        </p>
    </ImageSliderItem>
    <ImageSliderItem image="/images/header/osakajo.jpg">
        <h1 className="text-white font-semibold text-5xl">
            Pick up Japanese with <b className="text-red-600">Jp</b>launch.
        </h1>
        <p className="mt-4 text-lg text-gray-300">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Vivamus nec finibus nisl. Mauris quis erat vitae tellus venenatis lobortis.
        </p>
    </ImageSliderItem>
</ImageSliderManager>
```

2. Pagination higher order component <br/>
this hoc will create pagination functionality in the table.<br />
- pass data to originalData<br />
- pagination hoc will pass paginated data to children component as "data" props.<br/>
```html
<Paginator originalData={userData}>
    <SelectableTable actionsRequired={true} columns={ADMIN_USER_TABLE_COLUMNS}/>
</Paginator>
```


# Next.js CSS Module, Component-level styles
https://nextjs.org/blog/next-9-2#built-in-css-module-support-for-component-level-styles<br>
css: [component name].module.css<br>
<code>
.error {
  color: white;
  background-color: red;
}
</code>

component:
```html
 import styles from './Button.module.css'

 <button className={styles.error} >click</button>
```

# End to End testing with Cypress
Automated browser testing with cypress.<br>
If you start e2e with cypress for the first time, go to "/blog/frontend" in your host machine<br>
<code>npm install --save-dev cypress cypress-file-upload</code><br>
In order to start cypress test, <br>
<code>npm test</code><br>
this will start the new window. select the test js file to execute. test files are in frontend/cypress.<br>
For more info: https://docs.cypress.io/api/api/table-of-contents.html<br>


