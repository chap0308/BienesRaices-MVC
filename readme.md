#ENV:
- BD_NOMBRE=bienesraices_node_mvc
- BD_USER=root
- BD_PASS=
- BD_HOST=localhost

- EMAIL_HOST=smtp.mailtrap.io
- EMAIL_PORT=
- EMAIL_USER=
- EMAIL_PASS=

- BACKEND_URL=http://localhost

- JWT_SECRET=palabrasupersecretaaaaaaa

# COMANDOS IMPORTANTES(siempre iniciarlos despues de instalar todo lo de abajo):
- npm run server
- npm run css
- npm run js//webpack(mapa)

# PARA JUNTAR LAS TERMINALES DEL FRONTED(npm run css/npm run js)
- npm i -D concurrently
#  "scripts": {
    "dev": "concurrently \"npm run css\" \"npm run js\" "
# }
# UNA VEZ QUE COLOCES LO DE ARRIBA, EJECUTA EL SIGUIENTE CODIGO:
- npm run dev
///////////////////////////////////////////
# Pasos para instalar todas las dependencias:
- npm init 

# luego instalar express
- npm i express

# "dependencies": {
    "express": "^4.18.2",
# }
---------------------
# luego instalar nodemon
- npm i -D nodemon

# "devDependencies": {
    "nodemon": "^2.0.22",
# }
# "scripts": {
    "start": "node index.js",
    "server": "nodemon index.js"
# }
# correr el nodemon
- npm run server

---------------------------
# instalar pug
- npm i pug

# instalar tailwindcss
- npm i -D tailwindcss autoprefixer postcss postcss-cli

# luego de crear en public la carpeta css y el archivo tailwind:
- npx tailwindcss init -p
# en tailwind.config.js: content: ['./views/**/*.pug'],
# en package.json "scripts":{"css": "postcss public/css/tailwind.css -o public/css/app.css --watch"}
- npm run css
- npm i sequelize mysql2

# import dotenv from 'dotenv'; dotenv.config({path: '.env'}); //luego control C en el nodemon y volver a iniciarlo con npm run server

- npm i express-validator
- npm i dotenv
- npm i bcrypt
- npm i nodemailer
- npm i csurf cookie-parser
- npm i jsonwebtoken
- npm i -D webpack webpack-cli
#   "scripts": {
    "js": "webpack --watch"
# }
--------------
#   "scripts": {
    "db:importar":"node ./seed/seeder.js -i"
# }
# Ejecutar una vez que hayas colocado lo de arriba y hayas realizado el codigo en la carpeta seed (video 83)
- npm run db:importar
# Si quieres borrarlo y poner datos nuevos
- npm run db:eliminar
-------------------
- npm i dropzone@5.9.3
- npm i multer
