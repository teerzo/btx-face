// npm
// import * as THREE from 'three';
const THREE = require('three');
const OBJLoader = require('three-obj-loader');
// const OrbitControls = require('three-orbitcontrols')
const OrbitControls = require('./js/orbitcontrols')

const feather = require('feather-icons');
const axios = require('axios');

OBJLoader(THREE);

// css
import './css/main.scss';

let app = {

    clock: new THREE.Clock(),

    conditions: {
        path: './data/conditions.json',
        downloading: null,
        loading: null,
        list: [],
        rawList: [],
    },
    muscles: {
        path: './data/muscles.json',
        downloading: null,
        loading: null,
        list: [],
        rawList: [],
    },
    models: {
        path: '',
        downloading: null,
        loading: null,
        list: [],
        rawList: [],
    },
    textures: {
        path: '',
        downloading: null,
        loading: null,
        list: [],
        rawList: [],
    },


    modelList: null,
    textureList: null,

    meshList: [],
    objectList: [],


    resizeEnd: null,


    menuToggle: false,


    cameraLastPos: new THREE.Vector3(0, 0, 0),

    // Loaders
    OBJLoader: new THREE.OBJLoader(),



    initialize: function () {
        // replace icons
        feather.replace({ class: '', width: '30', height: '30', color: '#333333' });

    
        app.getMuscles();
        // getConditions();

        // getModels();
        // getTextures();


        axios.get('./data/models.json').then(function (response) {
            // console.log(response);
            if (response.data) {
                app.modelList = response.data.modelList;
                app.textureList = response.data.textureList;

                initFace();
            }
        })

        initEventListeners();
        initDom();

        initThree();
        initScene();
        initObjects();

        app.loop();
    },
    loop: function () {
        let dt = 0.1;
    
        update(dt);
    
        // console.log('loop');
        requestAnimationFrame(app.loop);
        if (app.scene) {
            // console.log(app.scene.children);
            if (app.scene.children && app.scene.children.length > 0) {
                for (var i = 0; i < app.scene.children.length; i++) {
                    const child = app.scene.children[i];
                    if (child.update) {
                        child.update(dt);
                    }
                }
            }
        }
    
        let clearColour = 0xAAAAAA;
        app.renderer.clear();
        app.renderer.setClearColor(clearColour);
        app.renderer.render(app.scene, app.camera);
    
        app.renderer.render(app.scene, app.camera);
    },
    getMuscles: function() {
        app.muscles.downloading = true;

        axios.get(app.muscles.path).then(function (response) {
            // console.log(response);
            if (response.data) {
                console.log(response.data);
                app.muscles.downloading = false;
                app.muscles.loading = true;
                app.rawList = response.data;
                app.initDOMMuscles(response.data);
                // debugger;
            }
        });

    },

    initDOMMuscles: function(list) {
        for( let i in list) {
            console.log(list[i]);
        }
    },
    updateDOMMuscles: function(list) {

    },
};







const initEventListeners = function () {
    window.addEventListener('resize', onResize);
    window.addEventListener('resize-end', onResizeEnd);

    let btnReset = document.getElementById('btn-reset');
    let btnMenuOff = document.getElementById('btn-menu-off');
    let btnMenuOn = document.getElementById('btn-menu-on');

    btnReset.onclick = (event) => {
        event.preventDefault();
        resizeThree();
        return false;
    }

    btnMenuOff.onclick = (event) => {
        event.preventDefault();
        onToggleMenu(event);
        return false;
    }
    btnMenuOn.onclick = (event) => {
        event.preventDefault();
        onToggleMenu(event);
        return false;
    }
};

const initDom = function () {
    let menuOff = document.getElementById('btn-menu-off');
    let menuOn = document.getElementById('btn-menu-on');

    menuOff.classList.add('active');
    menuOff.classList.remove('inactive');
    menuOn.classList.remove('active');
    menuOn.classList.add('inactive');
}

// DOM EVENTS

const onToggleMenu = function (event) {
    console.log('onToggleMenu', event);

    let menuOff = document.getElementById('btn-menu-off');
    let menuOn = document.getElementById('btn-menu-on');

    let navItems = document.getElementById('nav-items');

    if (!app.menuToggle) {
        menuOff.classList.remove('active');
        menuOff.classList.add('inactive');

        menuOn.classList.add('active');
        menuOn.classList.remove('inactive');

        navItems.classList.add('active');
    }
    else {
        menuOff.classList.add('active');
        menuOff.classList.remove('inactive');
        menuOn.classList.remove('active');
        menuOn.classList.add('inactive');

        navItems.classList.remove('active');
    }
    app.menuToggle = !app.menuToggle;
}

const onResize = function (event) {
    // console.log('onResize', event);
    clearTimeout(app.resizeEnd);
    app.resizeEnd = setTimeout(function () {
        // option 1
        var evt = new Event('resize-end');
        window.dispatchEvent(evt);
        // option 2: old-fashioned
        /*var evt = document.createEvent('Event');
        evt.initEvent('resize-end', true, true);
        window.dispatchEvent(evt);*/
    }, 100);
};
const onResizeEnd = function (event) {
    console.log('onResizeEnd', event);
    resizeThree(event);
}

const resizeThree = function (event) {
    let width = window.innerWidth - 20;
    let height = (window.innerWidth <= 768 ? window.innerHeight - 60 : window.innerHeight - 60);

    // app.scene = new THREE.Scene();
    app.camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 200);
    app.camera.updateProjectionMatrix();
    app.camera.position.y = 10;
    app.camera.position.z = 30;
    // app.renderer = new THREE.WebGLRenderer();
    // app.renderer.antialias = true;
    app.renderer.setSize(width, height);

    app.controls = new OrbitControls(app.camera, app.renderer.domElement)
    app.controls.target = new THREE.Vector3(0, 11, 0);
    // app.controls.enableDamping = true
    // app.controls.dampingFactor = 0.25
    app.controls.enableZoom = true


    app.domRoot = document.getElementById('container');
    app.domRoot.innerHTML = '';
    app.domRoot.appendChild(app.renderer.domElement);
};


// Data requests

const getMuscles = function () {

}
const getConditions = function() {

}
const getModels = function() {

}
const getTextures = function() {

}


const initThree = function () {
    let width = window.innerWidth - 20;
    let height = (window.innerWidth <= 768 ? window.innerHeight - 60 : window.innerHeight - 60);

    app.scene = new THREE.Scene();
    app.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    app.camera.position.y = 10;
    app.camera.position.z = 30;

    app.renderer = new THREE.WebGLRenderer();
    app.renderer.antialias = true;
    app.renderer.setPixelRatio(window.devicePixelRatio);
    app.renderer.setSize(width, height);

    app.controls = new OrbitControls(app.camera, app.renderer.domElement)
    app.controls.target = new THREE.Vector3(0, 11, 0);
    // app.controls.enableDamping = true
    // app.controls.dampingFactor = 0.25
    app.controls.enableZoom = true

    app.domRoot = document.getElementById('container');
    app.domRoot.appendChild(app.renderer.domElement);
};

const initScene = function () {
    var light = new THREE.AmbientLight(0x404040); // soft white light
    app.scene.add(light);

    var spotLight = new THREE.SpotLight(0xffffff, 1, 100, 10);
    spotLight.position.set(0, 5, 50);
    app.scene.add(spotLight);

    // var spotLightHelper = new THREE.SpotLightHelper( spotLight );
    // app.scene.add( spotLightHelper );

    let lightUpdate = function () {
        var t = (Date.now() / 2000);
        // move light in circle around center
        // change light height with sine curve

        var r = 10.0;

        var lx = r * Math.cos(t);
        var lz = r * Math.sin(t);

        var ly = 5.0 + 5.0 * Math.sin(t / 3.0);

        this.position.set(lx, ly, lz);
        this.lookAt(new THREE.Vector3(0, 0, 0));
    };
    // spotLight.update = lightUpdate;


}

const initObjects = function () {
    let geometry = new THREE.BoxGeometry(1, 1, 1);
    let material = new THREE.MeshPhongMaterial({ color: 0xFF0000, flatShading: true, wireframe: false, visible: false });
    let cube = new THREE.Mesh(geometry, material);
    cube.scale.x = 2;
    cube.scale.y = 2;
    cube.scale.z = 2;
    cube.update = function (dt) {
        // this.rotation.x += 0.01;
        // this.rotation.y += 0.01;
        var t = (Date.now() / 1000);
        // move light in circle around center
        // change light height with sine curve

        var r = 10.0;

        var lx = r * Math.cos(t);
        var lz = r * Math.sin(t);

        // var ly = 5.0 + 5.0 * Math.sin( t / 3.0 );
        var ly = 0;

        this.position.set(lx, ly, lz);
        this.lookAt(app.camera.position);
    }
    // app.scene.add(cube);

    var loader = new THREE.FontLoader();
    // console.log('loader start');

    loader.load('./fonts/helvetiker_regular.typeface.json', function (font) {
        // console.log('loader finished');
        // console.log('font', font);
        var geometry = new THREE.TextGeometry('Teerzo', {
            font: font,
            size: 80,
            height: 1,
            curveSegments: 12,
            bevelEnabled: false,
            bevelThickness: 10,
            bevelSize: 0,
            bevelSegments: 5
        });

        // new THREE.MeshPhongMaterial({ color: 0x00ff00, flatShading: true, wireframe: false});
        var material = new THREE.MeshPhongMaterial({ color: 0x00ff00, flatShading: true, wireframe: false });
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = -9;
        mesh.position.y = 0;
        mesh.position.z = 0;


        mesh.scale.x = 0.05;
        mesh.scale.y = 0.05;
        mesh.scale.z = 0.05;

        // mesh.add(cube);

        mesh.update = function () {
            // console.log('updating text geo');
            var t = (Date.now() / 1000);
            // move light in circle around center
            // change light height with sine curve

            var r = 10.0;

            var lx = r * Math.cos(t);
            var lz = r * Math.sin(t);

            var ly = 5.0 + 5.0 * Math.sin(t / 3.0);

            this.position.set(lx, ly, lz);
            this.lookAt(app.camera.position);
        }

        cube.add(mesh);
    });

    // if( font ) {
    //     let geometry = new THREE.TextGeometry( 'Hello three.js!', {
    //         font: font.data,
    //         size: 80,
    //         height: 5,
    //         curveSegments: 12,
    //         bevelEnabled: true,
    //         bevelThickness: 10,
    //         bevelSize: 8,
    //         bevelSegments: 5
    //     });
    //     app.scene.add(geometry);
    // }
}

const initFace = function () {
    console.log('initFace');

    if (app.OBJLoader) {

        let meshCallback = function (index, mesh) {
            // console.log('meshCallback', index, mesh);

            // console.log(app.modelList[index]);
            let data = {
                name: app.modelList[index].displayName,
                mesh: mesh,
            }

            app.meshList.push(data);

            // console.log('length', app.meshList.length, app.modelList.length);
            if (app.meshList.length === app.modelList.length) {
                initFaceObjects();
            }
        }

        let meshes = [];
        for (let i in app.modelList) {
            // console.log(app.modelList[i]);
            app.OBJLoader.load('./obj/' + app.modelList[i].fileName + '.' + app.modelList[i].fileType, function (item) {
                // console.log(item);
                meshCallback(i, item)
            });
        }
    }
}

const initFaceObjects = function () {
    console.log('initFaceObjects');

    // console.log(app.meshList);
    if (app.meshList && app.meshList.length > 0) {
        for (let i in app.meshList) {

            // console.log(app.meshList[i]);
            let objProps = {
                name: app.meshList[i].name,
                mesh: app.meshList[i].mesh,
            }

            let obj = createObject(objProps);
            obj.object.scale.multiplyScalar(8.0);
            app.objectList.push(obj);

        }
        updateScene();
    }

}



const createObject = function (props) {
    // console.log('createObject', props);
    if (props === undefined) { props = {}; }
    if (props.name && props.name !== '' && props.mesh) {
        let data = {};

        // let meshObj = props.mesh.clone();
        // let obj = new THREE.Object3D();

        let obj = props.mesh.clone();
        let mesh = obj.children[0];
        let material = new THREE.MeshPhongMaterial({ color: 0xFF0000 });

        obj.name = props.name;

        mesh.material = material;

        data.object = obj;
        data.object.children.push(mesh);

        data.mesh = mesh;
        data.material = material;


        return data;
    }
    else {
        return null;
    }
}

const updateScene = function () {
    // console.log('updateScene');

    // console.log(app.objectList);
    if (app.scene) {
        if (app.objectList && app.objectList.length > 0) {
            for (let i in app.objectList) {
                // console.log(app.objectList[i]);
                // debugger;

                app.scene.add(app.objectList[i].object);
            }
        }
    }
};

const update = function () {
    app.cameraLastPos.copy(app.camera.position);
    app.controls.update(app.clock.getDelta());

    if (app.camera.position.distanceTo(new THREE.Vector3(0, 0, 0)) > 100) {
        app.camera.position.copy(app.cameraLastPos);
        if (app.camera.position.distanceTo(new THREE.Vector3(0, 0, 0)) > 100) {
            var norm = app.camera.position;
            norm.normalize();
            norm.multiplyScalar(99);
            app.camera.position.copy(norm);
        }
    }

}




app.initialize();

