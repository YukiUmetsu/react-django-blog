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
1. add <code>DJANGO_SETTINGS_MODULE=blog.settings</code> in your .env file.\
2. Do NOT add "__init__.py" file under test folder. Otherwise, pytest can't find modules for some reason.<br>
3. start pytest
<code>docker container exec -it backend sh -c "pytest"</code>