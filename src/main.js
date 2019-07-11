console.log('test');

// npm
import * as THREE from 'three';
const feather = require('feather-icons')

// css
import './css/main.scss';

// font 
// import font from './fonts/helvetiker_regular.typeface.js';

let app = {

    

    resizeEnd: null,
    

    menuToggle: false,

    // scene: new THREE.Scene(),
    // camera: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
};








const initialize = function () {

    // feather.icons.menu.toSvg({ class: 'foo bar', width: '30', height: '30', color: 'red' });
    // feather.icons.x.toSvg();
    feather.replace({ class: 'foo bar', width: '30', height: '30', color: '#333333' });

    initEventListeners();
    initDom();

    initThree();
    initScene();
    initObjects();
};

const initEventListeners = function () {
    window.addEventListener('resize', onResize);
    window.addEventListener('resize-end', onResizeEnd);
    
    let btnMenuOff = document.getElementById('btn-menu-off');
    let btnMenuOn = document.getElementById('btn-menu-on');
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

const initDom = function() {
    let menuOff = document.getElementById('btn-menu-off');
    let menuOn = document.getElementById('btn-menu-on');

    menuOff.classList.add('active');
    menuOff.classList.remove('inactive');
    menuOn.classList.remove('active');
    menuOn.classList.add('inactive');
}

// DOM EVENTS

const onToggleMenu = function(event) {
    console.log('onToggleMenu', event);

    let menuOff = document.getElementById('btn-menu-off');
    let menuOn = document.getElementById('btn-menu-on');

    let navItems = document.getElementById('nav-items');

    if( !app.menuToggle ) {
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

const resizeThree = function(event) {
    let width = window.innerWidth - 20;
     let height = ( window.innerWidth <= 768 ? window.innerHeight - 70 : window.innerHeight - 70 );

    // app.scene = new THREE.Scene();
    app.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    app.camera.position.z = 50;
    // app.renderer = new THREE.WebGLRenderer();
    // app.renderer.antialias = true;
    app.renderer.setSize(width, height);

    app.domRoot = document.getElementById('container');
    app.domRoot.innerHTML = '';
    app.domRoot.appendChild(app.renderer.domElement);
};

const initThree = function () {
    let width = window.innerWidth - 20;
    let height = ( window.innerWidth <= 768 ? window.innerHeight - 70 : window.innerHeight - 70 );

    app.scene = new THREE.Scene();
    app.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    app.camera.position.z = 50;

    app.renderer = new THREE.WebGLRenderer();
    app.renderer.antialias = true;
    app.renderer.setSize(width,height);

    app.domRoot = document.getElementById('container');
    app.domRoot.appendChild(app.renderer.domElement);
};

const initScene = function() {
    var light = new THREE.AmbientLight( 0x404040 ); // soft white light
    app.scene.add( light );

    var spotLight = new THREE.SpotLight( 0xffffff, 1, 100, 10);
    spotLight.position.set( 0, 5, 50 );
    app.scene.add( spotLight );

    // var spotLightHelper = new THREE.SpotLightHelper( spotLight );
    // app.scene.add( spotLightHelper );

    let lightUpdate = function() {
        var t = ( Date.now() / 2000 );
        // move light in circle around center
        // change light height with sine curve

        var r = 10.0;

        var lx = r * Math.cos( t );
        var lz = r * Math.sin( t );

        var ly = 5.0 + 5.0 * Math.sin( t / 3.0 );

        this.position.set( lx, ly, lz );
        this.lookAt( new THREE.Vector3(0,0,0) );
    };
    // spotLight.update = lightUpdate;
    
    
}

const initObjects = function() {
    let geometry = new THREE.BoxGeometry(1, 1, 1);
    let material = new THREE.MeshPhongMaterial({ color: 0xFF0000, flatShading: true, wireframe: false, visible: false});
    let cube = new THREE.Mesh(geometry, material);
    cube.scale.x = 2;
    cube.scale.y = 2;
    cube.scale.z = 2;
    cube.update = function(dt) {
        // this.rotation.x += 0.01;
        // this.rotation.y += 0.01;
        var t = ( Date.now() / 1000 );
        // move light in circle around center
        // change light height with sine curve

        var r = 10.0;

        var lx = r * Math.cos( t );
        var lz = r * Math.sin( t );

        // var ly = 5.0 + 5.0 * Math.sin( t / 3.0 );
        var ly = 0;

        this.position.set( lx, ly, lz );
        this.lookAt( app.camera.position);
    }
    app.scene.add(cube);

    var loader = new THREE.FontLoader();
    console.log('loader start');
    
    loader.load( './fonts/helvetiker_regular.typeface.json', function ( font ) {
        console.log('loader finished');
        console.log('font', font);
        var geometry = new THREE.TextGeometry( 'Teerzo', {
            font: font,
            size: 80,
            height: 1,
            curveSegments: 12,
            bevelEnabled: false,
            bevelThickness: 10,
            bevelSize: 0,
            bevelSegments: 5
        } );

        // new THREE.MeshPhongMaterial({ color: 0x00ff00, flatShading: true, wireframe: false});
        var material = new THREE.MeshPhongMaterial({ color: 0x00ff00, flatShading: true, wireframe: false});
        var mesh = new THREE.Mesh( geometry, material ) ;
        mesh.position.x = -9;
        mesh.position.y = 0;
        mesh.position.z = 0;


        mesh.scale.x = 0.05;
        mesh.scale.y = 0.05;
        mesh.scale.z = 0.05;

        // mesh.add(cube);

        mesh.update = function( ) {
            // console.log('updating text geo');
            var t = ( Date.now() / 1000 );
            // move light in circle around center
            // change light height with sine curve

            var r = 10.0;

            var lx = r * Math.cos( t );
            var lz = r * Math.sin( t );

            var ly = 5.0 + 5.0 * Math.sin( t / 3.0 );

            this.position.set( lx, ly, lz );
            this.lookAt( app.camera.position);
        }

        cube.add(mesh);
    } );

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


const initLoop = function() {

};

const loop = function() {
    let dt = 0.1;
    // console.log('loop');
    requestAnimationFrame(loop);
    if( app.scene ) {
        // console.log(app.scene.children);
        if( app.scene.children && app.scene.children.length > 0 ) {
            for( var i = 0; i < app.scene.children.length; i++ ) {
                const child = app.scene.children[i];
                if( child.update ) {
                    child.update(dt);
                }
            }
        }
    }
    app.renderer.render(app.scene, app.camera);
};

initialize();
initLoop();
loop();

