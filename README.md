# Simple blog project

This project was built on various workstations running debian 11 (bullseye), devuan 4 (chimaera) and KDE neon also under various CPU architectures;  namely amd64, armhf and aarch64.  Hold on, what's that you say?  **_HOW_** armhf?  Especially when mongodb dropped support for 32-bit?  The answer is, the DB isn't running locally.

## Software used:

| Package | Version | Source |
| ------- | ------- | ------ |
| [nodejs](https://nodejs.org/en) | 12.x | distribution repositories |
| [nodejs](https://nodejs.org/en) | 12.22.12 | [nodesource](https://github.com/nodesource/distributions) *neon only |
| npm | 7.5.2 | repos |
| npm | 8.12.1 | [nodesource](https://github.com/nodesource/distributions) *neon only `npm i -g npm` |
| [restify](http://restify.com) | 8.x | npm package |
| [nextjs](https://nextjs.org) | 12.x | installed on initial `create-next-app` |
| [react](https://reactjs.org) | 18.x | installed on initial `create-next-app` |
| [mongodb community edition](https://www.mongodb.com/docs/v4.4/administration/install-community) | 4.4.14 | mongodb repositories |
| [mongoose](https://mongoosejs.com) | 6.x | npm package |
| [bootstrap](https://getbootstrap.com/docs/4.5/getting-started/introduction) | 4.5.0 | cloudflare cdn, direct download |
| [materializecss](http://archives.materializecss.com/0.100.2) | 0.100.2 | cloudflare cdn |
| [ckeditor5-react](https://ckeditor.com) | 34.x/5.x | `npm i ckeditor5-react` |


## Image attribution:

Favicon from [https://www.flaticon.com](https://www.flaticon.com) by author [dDara](https://www.flaticon.com/authors/ddara).

Sample monkey avatar icon from [https://www.freepik.com](https://www.freepik.com)


## Even more explanations:

Originally, this project started as a class based native React project.  It was separated in to two parts, a frontend and a backend.  The frontend being handled by React and the backend being handled by restify.  Then a new challenger appeared in the form of Next.JS.  Both the frontend and the backend were then merged and handled by Next.

The old restify/React code combines the endpoints for `post` and `static` whereas the Next.JS code separates the two for backend calls.  The newer code also handles manipulating `static` pages fully as well, negating the need to use utility functions outside the frontend on the command line to create the pages in the database manually.

This project is very simple.  When the administrator is not logged in, it displays created entries, along while dynamically generating links in the navbar to route to the `static` pages (ie About, Contact, etc.)  Additional buttons and links appear to add `post`s and `static` pages (sections) and to update and delete these `post`s and `section`s.  The default login page is `<webapp location>/quixotic` which can be change easily by editing `App.jsx` for the React code or renaming the file `pages/quixotic.js` to a different name (maybe not to the cliche `login`).

The mongoose package requires at least mongodb v4.0.x to work properly as installed by this project.  To use older versions of mongodb (for instance, v3.2.11 still in 32 bit debian stretch repositories), requires a downgrade of mongoose to ^3.8.22 according to [documentation](https://mongoosejs.com/docs/compatibility.html).  It will also require a change to the `Model` declarations within their respective backends (timestamps come to mind).  This might be useful, if you're planning to run this project on an old [raspberry pi](https://www.raspberrypi.org) or similar hardware that only supports 32 bit armhf.  It's definitely **NOT** recommended, from a resource point of view and a security point of view.  But hey, sometimes you have an old NAS that you want to get more use out of that has a very limited armhf processor in it (I'm looking at YOU, [Synology](https://www.synology.com/en-global/support/download/DS216se?version=7.1#docs)!).


## File listing (for the lulz):
```
.
├── assets
│   ├── monkey.png
│   ├── palette.png
│   └── project-management.png
├── backend
│   ├── docs
│   │   └── Access and Endpoints.ods
│   ├── env.example
│   ├── models
│   │   ├── Blacklist.js
│   │   ├── Login.js
│   │   ├── Owner.js
│   │   ├── Post.js
│   │   ├── Static.js
│   │   └── TokenWhitelist.js
│   ├── package.json
│   ├── package-lock.json
│   ├── routes
│   │   ├── authenticate.js
│   │   ├── endpoints.js
│   │   └── posts.js
│   ├── server.js
│   └── utility
│       ├── about.js
│       ├── addowner.js
│       ├── bauth.js
│       ├── cache.service.js
│       ├── gensecret.js
│       ├── jwtutils.js
│       ├── owner.js
│       └── owner.js.sample
├── frontend
│   ├── package.json
│   ├── package-lock.json
│   ├── public
│   │   ├── index.html
│   │   ├── monkey.png
│   │   ├── project-management.png
│   │   └── robots.txt
│   └── src
│       ├── App.jsx
│       ├── components
│       │   ├── Fragments
│       │   │   ├── Avatar.jsx
│       │   │   ├── Error.jsx
│       │   │   ├── Post.jsx
│       │   │   └── Posts.jsx
│       │   ├── layout
│       │   │   ├── Footer.jsx
│       │   │   └── Header.jsx
│       │   └── views
│       │       ├── About.jsx
│       │       ├── Display.jsx
│       │       ├── Login.jsx
│       │       ├── Main.jsx
│       │       ├── PostEditor.jsx
│       │       └── SectionEditor.jsx
│       ├── index.css
│       ├── index.jsx
│       ├── logo.png
│       └── reportWebVitals.js
├── nextjs
│   ├── be
│   │   ├── bauth.js
│   │   ├── dbConnect.js
│   │   ├── jwtutils.js
│   │   ├── models
│   │   │   ├── Blacklist.js
│   │   │   ├── Login.js
│   │   │   ├── Owner.js
│   │   │   ├── Post.js
│   │   │   ├── Static.js
│   │   │   └── TokenWhitelist.js
│   │   ├── postutils.js
│   │   └── staticutils.js
│   ├── components
│   │   ├── avatar.js
│   │   ├── delete.js
│   │   ├── edit.js
│   │   ├── editor.js
│   │   ├── empty.js
│   │   ├── navlinks.js
│   │   ├── post.js
│   │   ├── posts.js
│   │   └── submit.js
│   ├── context
│   │   ├── auth_context.js
│   │   ├── network_context.js
│   │   ├── post_context.js
│   │   └── static_context.js
│   ├── env.local.example
│   ├── layout
│   │   ├── footer.js
│   │   ├── header.js
│   │   └── main_layout.js
│   ├── next.config.js
│   ├── package.json
│   ├── package-lock.json
│   ├── pages
│   │   ├── 404.js
│   │   ├── api
│   │   │   ├── ends.js
│   │   │   ├── login.js
│   │   │   ├── logout.js
│   │   │   ├── post
│   │   │   │   └── [[...titleHash]].js
│   │   │   ├── posts.js
│   │   │   ├── refresh.js
│   │   │   ├── static
│   │   │   │   └── [[...section]].js
│   │   │   └── statics.js
│   │   ├── _app.js
│   │   ├── _document.js
│   │   ├── index.js
│   │   ├── post
│   │   │   ├── add.js
│   │   │   ├── edit.js
│   │   │   └── index.js
│   │   ├── quixotic.js
│   │   ├── section
│   │   │   ├── add.js
│   │   │   └── edit.js
│   │   └── [section].js
│   ├── public
│   │   ├── css
│   │   │   └── bootstrap.min.css
│   │   ├── js
│   │   │   ├── bootstrap.min.js
│   │   │   ├── jquery.min.js
│   │   │   └── popper.min.js
│   │   ├── monkey.png
│   │   └── project-management.png
│   └── styles
│       └── globals.css
├── README.md
└── vagrant
    ├── add_mongo_admin.js
    ├── install_mongodb-4.2.sh
    ├── install_node-12.x.sh
    ├── mongod.conf
    ├── update.sh
    └── Vagrantfile
```


## Final notes:

Read that LibreOffice doc in the `backend` directory to see what's what.  Or you can just `npm i` in the same directory, then `npm run dev` and head to `http://localhost:5000/ends` to see the same information.  Or easier yet, just read `endpoints.js` in the `routes` directory of `backend`.  :-D  The placeholder is there for the nextjs code to duplicate that endpoint in the frontend, but it is not implemented.  Maybe another day down the line.

Another thing implemented in the restify code that's been left out of the nextjs api is server side caching through the `node-cache` npm package.  It seemed like a nice feature to drop in at the time, and it was consciously chosen to remain unimplemented on the nextjs side.  Still a good idea, and maybe it'll get thrown it in at a later date.

At the earliest stages of putting this project together, `vagrant` was a thing that was heavily leaned upon until `lxc` became indispensable as a development tool to myself.  The problem was not in and of itself purely a `vagrant` thing, it was a `virtualbox` slow-as-molasses-get-me-out-of-here-and-throw-this-computer-in-to-the-garbage-to-make-it-run-faster thing.  Which really didn't become apparent until briefly working with a very resource limited workstation that had no hardware virtualization support.  The `vagrant` directory hangs out due to those beginnings and even gets updated from time to time to reflect changes occuring in my linux container workflow.
