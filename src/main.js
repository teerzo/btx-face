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

    objectScale: new THREE.Vector3(8, 8, 8),

    // dom btn/select variables
    conditionId: null,
    muscleGroupId: null,
    muscleIds: [],
    muscleId: null,

    leftVisible: true,
    rightVisible: true,


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
        path: './data/models.json',
        downloading: null,
        loading: null,
        list: [],
        rawList: [],
    },
    modelsMisc: {
        path: './data/modelsMisc.json',
        downloading: null,
        loading: null,
        list: [],
        rawList: [],
    },
    textures: {
        path: './data/textures.json',
        downloading: null,
        loading: null,
        list: [],
        fullList: [],
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
    textureLoader: new THREE.TextureLoader(),


    initialize: function () {
        // replace icons
        feather.replace({ class: '', width: '30', height: '30', color: '#333333' });



        app.getMuscles().then(() => {
            app.getConditions().then(() => {
                app.getTextures().then(() => {
                    app.getModels().then(() => {
                        app.getModelsMisc().then(() => {
                            app.loadTextures().then(() => {
                                app.loadModels().then(() => {
                                    app.initModels().then(() => {
                                        app.updateDom();
                                        
                                        console.log('initModels done');
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });

        initEventListeners();
        initDom();

        initThree();
        initScene();
        // initObjects();

        app.hideLoading();

        app.reset();
        app.loop();
    },
    reset: function () {
        console.log('reset');

        app.resetCamera();

        app.resetSelectCondition();
        app.resetSelectMuscle();

        resizeThree();
        app.resetObjects();
    },
    resetCamera: function () {
        if (app.renderer) {
            let width = window.innerWidth - 20;
            let height = (window.innerWidth <= 768 ? window.innerHeight - 60 : window.innerHeight - 60);
            app.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
            app.camera.position.y = 10;
            app.camera.position.z = 30;

            app.controls = new OrbitControls(app.camera, app.renderer.domElement)
            app.controls.target = new THREE.Vector3(0, 11, 0);
            // app.controls.enableDamping = true
            // app.controls.dampingFactor = 0.25
            app.controls.enableZoom = true;
        }
    },
    resetObjects: function () {
        for (let i in app.objectList) {
            let item = app.objectList[i];
            console.log(item);

            item.visible = true;
            item.selected = false;

            item.object.position.set(0, 0, 0);
            item.object.scale.copy(app.objectScale);
        }
        app.updateObjects();
    },
    loop: function () {
        let dt = 0.1;

        update(dt);

        // console.log('loop');
        requestAnimationFrame(app.loop);
        if (app.scene) {
            // console.log(app.scene.children);
            // if (app.scene.children && app.scene.children.length > 0) {
            //     for (var i = 0; i < app.scene.children.length; i++) {
            //         const child = app.scene.children[i];
            //         if (child.update) {
            //             child.update(dt);
            //         }
            //     }
            // }
        }

        let clearColour = 0xAAAAAA;
        app.renderer.clear();
        app.renderer.setClearColor(clearColour);
        app.renderer.render(app.scene, app.camera);

        app.renderer.render(app.scene, app.camera);
    },

    hideLoading: function () {
        let domLoading = document.getElementById('loading');

        window.setTimeout(() => {
            domLoading.classList.add('anim');
            window.setTimeout(() => {
                domLoading.classList.add('hide');
            }, 500);
        }, 2000);
    },

    clickStart: function(event) {
        console.log('clickStart', event);
    },

    getMuscles: function () {
        return new Promise(function (resolve, reject) {
            app.muscles.downloading = true;

            axios.get(app.muscles.path).then(function (response) {
                // console.log(response);
                if (response.data) {
                    console.log(response.data);
                    app.muscles.downloading = false;
                    app.muscles.loading = true;
                    app.fullMuscles = response.data;

                    // app.updateDom();
                    console.log('getMuscles resolve');
                    resolve();
                }
            });
        })
    },

    getConditions: function () {
        console.log('getConditions');
        return new Promise(function (resolve, reject) {
            app.conditions.downloading = true;

            axios.get(app.conditions.path).then(function (response) {
                // console.log(response);
                if (response.data) {
                    console.log(response.data);
                    app.conditions.downloading = false;
                    app.conditions.loading = true;
                    app.conditions.fullList = response.data;

                    // app.updateDom();
                    console.log('getConditions resolve');
                    resolve();
                }
            });
        })
    },
    getTextures: function () {
        return new Promise(function (resolve, reject) {
            app.textures.downloading = true;

            axios.get(app.textures.path).then(function (response) {
                // console.log(response);
                if (response.data) {
                    console.log(response.data);
                    app.textures.downloading = false;
                    app.textures.loading = true;
                    app.textures.fullList = response.data;


                    console.log('getTextures resolve');
                    resolve();
                }
            });
        })
    },
    getModels: function () {
        console.log('getModels');
        return new Promise(function (resolve, reject) {
            app.models.downloading = true;

            axios.get(app.models.path).then(function (response) {
                // console.log(response);
                if (response.data) {
                    console.log(response.data);
                    app.models.downloading = false;
                    app.models.loading = true;
                    app.models.fullList = response.data;
                    // app.textures.fullList = response.data.textureList;
                    // app.updateDom();

                    console.log('getModels resolve');
                    resolve();
                }
            });
        });
    },
    getModelsMisc: function () {
        return new Promise(function (resolve, reject) {
            app.modelsMisc.downloading = true;

            axios.get(app.modelsMisc.path).then(function (response) {
                // console.log(response);
                if (response.data) {
                    console.log(response.data);
                    app.modelsMisc.downloading = false;
                    app.modelsMisc.loading = true;
                    app.modelsMisc.fullList = response.data;

                    console.log('getModelsMisc resolve');
                    resolve();
                }
            });
        })
    },


    loadTextures: function () {
        console.log('loadTextures');
        return new Promise(function (resolve, reject) {
            if (app.textureLoader) {
                let promises = [];
                for (let i in app.textures.fullList) {
                    let promise = new Promise(function (resolve, reject) {
                        app.textureLoader.load('./tex/' + app.textures.fullList[i].path, function (texture) {
                            console.log('texture loaded', texture);
                            app.textures.list.push({ name: app.textures.fullList[i].name, texture: texture });
                            resolve();
                        });
                    });
                    promises.push(promise);
                }
                Promise.all(promises).then(function () {
                    console.log('loadTextures resolve');
                    resolve();
                })
            }
        });
    },
    loadModels: function () {
        console.log('loadModels');
        return new Promise(function (resolve, reject) {
            if (app.OBJLoader) {

                let promises = [];
                for (let i in app.models.fullList) {
                    const md = app.models.fullList[i];
                    if (md.fileName !== '') {
                        let promise = new Promise(function (resolve, reject) {
                            app.OBJLoader.load('./obj/' + md.fileName + '.' + md.fileType, function (model) {
                                app.models.list.push({ id: md.id, type: 'muscle', name: md.name, mesh: model, texture: md.texture });
                                console.log('model', model);

                                resolve();
                            });
                        });
                        promises.push(promise);
                    }
                }
                for (let i in app.modelsMisc.fullList) {
                    const md = app.modelsMisc.fullList[i];
                    if (app.modelsMisc.fullList[i].fileName !== '') {
                        let promise = new Promise(function (resolve, reject) {
                            app.OBJLoader.load('./obj/' + md.fileName + '.' + md.fileType, function (model) {
                                app.modelsMisc.list.push({ id: md.id, type: 'misc', name: md.name, mesh: model, texture: md.texture });
                                console.log('model', model);

                                resolve();
                            });
                        });
                        promises.push(promise);
                    }
                }
                Promise.all(promises).then(function () {
                    console.log('loadModels resolve');
                    resolve();
                })
            }
        });
    },

    getTexture: function (name) {
        var result;
        for (var i = 0; i < app.textures.list.length; i++) {
            if (app.textures.list[i].name === name) {
                result = app.textures.list[i].texture;
            }
        }
        return result;
    },
    updateSelectMuscles: function (list) {
        console.log('$ updateSelectMuscles');
        let domSelect = document.getElementById('navSelectMuscles');

        if (domSelect.options.length > 0) {
            for (let i in domSelect.options) {
                domSelect.remove(i);
            }
        }

        let option = document.createElement('option');
        option.text = 'Please select..'
        option.value = '';

        domSelect.add(option);

        // debugger;
        for (let i = 0; i < list.length; i++) {

            console.log(list[i]);

            let option = document.createElement('option');
            option.text = list[i].groupName;
            option.value = list[i].id;

            domSelect.add(option);
        }
    },
    updateSelectConditions: function (list) {
        let domSelect = document.getElementById('navSelectConditions');
        for (let i in list) {
            // console.log(list[i]);
            let option = document.createElement('option');
            option.text = list[i].name;
            option.value = list[i].id;

            domSelect.add(option);
        }
    },
    selectCondition: function (id) {
        console.log('selectCondition', id);
        for (let i in app.conditions.fullList) {
            if (app.conditions.fullList[i].id === id) {
                // app.sele
                app.updateMetaDom(app.conditions.fullList[i]);
            }
        }
    },
    selectMuscleGroup: function (id) {
        console.log('selectMuscleGroup', id);

        app.muscleGroupId = id;


        let ids = [];
        for (let i in app.combinedMuscles) {
            if (app.combinedMuscles[i].id === id) {
                for (let j in app.combinedMuscles[i].muscles) {
                    ids.push(app.combinedMuscles[i].muscles[j].id);
                }
            }
        }
        app.muscleIds = ids;

        // debugger;
        for (let i in app.objectList) {
            let item = app.objectList[i];

            item.selected = false;
            item.transparent = false;

            for (let j in ids) {
                if (item.type === 'muscle') {
                    if (item.id === ids[j]) {
                        item.selected = true;

                    }
                }
            }
        }
        app.updateObjects();
    },

    resetSelectCondition: function () {
        app.conditionId = null;

        let domSelectCondition = document.getElementById('navSelectConditions');
        domSelectCondition.selectedIndex = 0;


    },

    resetSelectMuscle: function () {
        app.muscleGroupId = null;
        app.muscleIds = [];
        app.muscleId = null;

        let domSelectCondition = document.getElementById('navSelectMuscles');
        domSelectCondition.selectedIndex = 0;
    },

    // const initFace = function () {
    initModels: function () {
        console.log('initModels');
        return new Promise(function (resolve, reject) {
            if (app.models.list && app.models.list.length > 0) {
                for (let i in app.models.list) {
                    // console.log(app.meshList[i]);
                    let objProps = {
                        id: app.models.list[i].id,
                        type: app.models.list[i].type,
                        name: app.models.list[i].name,
                        mesh: app.models.list[i].mesh,
                        texture: app.models.list[i].texture,
                    }

                    let obj = createObject(objProps);
                    // obj.object.scale
                    app.objectList.push(obj);
                }
            }
            if (app.modelsMisc.list && app.modelsMisc.list.length > 0) {
                for (let i in app.modelsMisc.list) {
                    // console.log(app.meshList[i]);
                    let objProps = {
                        id: app.modelsMisc.list[i].id,
                        type: app.modelsMisc.list[i].type,
                        name: app.modelsMisc.list[i].name,
                        mesh: app.modelsMisc.list[i].mesh,
                        texture: app.modelsMisc.list[i].texture,
                    }

                    let obj = createObject(objProps);
                    // obj.object.scale.multiplyScalar(8.0);
                    app.objectList.push(obj);
                }
            }
            updateScene();
            resolve();
        });

    },


    updateMetaDom: function (condition) {
        console.log('updateMetaDom', condition);

        let metaConditionName = document.getElementById('metaConditionName');
        let metaNumPatients = document.getElementById('metaNumPatients');
        let metaNumSessions = document.getElementById('metaNumSessions');
        let metaAverageAge = document.getElementById('metaAverageAge');
        let metaPercentageMale = document.getElementById('metaPercentageMale');
        let metaPercentageFemale = document.getElementById('metaPercentageFemale');

        metaConditionName.innerHTML = condition.name;
        metaNumPatients.innerHTML = condition.meta.numberOfPatients;
        metaNumSessions.innerHTML = condition.meta.numberOfSessions;
        metaAverageAge.innerHTML = condition.meta.averageAge;
        metaPercentageMale.innerHTML = condition.meta.percentageMale;
        metaPercentageFemale.innerHTML = condition.meta.percentageFemale;
    },
    updateDom: function () {
        console.log('updateDom');



        let muscles = [];
        let conditions = [];

        // check conditions
        for (let i in app.conditions.fullList) {
            // app
            conditions.push(app.conditions.fullList[i]);
        }

        let combinedMuscles = [];
        for (let i in app.fullMuscles) {
            console.log(app.fullMuscles[i]);

            let match = true;
            for (let j in combinedMuscles) {
                if (combinedMuscles[j].groupName === app.fullMuscles[i].groupName) {
                    match = false;
                    combinedMuscles[j].muscles.push(app.fullMuscles[i]);
                }
            }
            if (match) {
                let group = {
                    groupName: app.fullMuscles[i].groupName,
                    muscles: [],
                }
                group.muscles.push(app.fullMuscles[i]);
                combinedMuscles.push(group);
            }

            // app
        }

        console.log(combinedMuscles);
        // debugger;

        for (let i in combinedMuscles) {
            // console.log(app.fullMuscles[i]);
            // app
            combinedMuscles[i].id = Number(i);
            muscles.push(combinedMuscles[i]);
        }

        app.combinedMuscles = combinedMuscles;


        app.updateSelectMuscles(muscles);
        app.updateSelectConditions(conditions);


    },
    updateObjects: function () {
        console.log('updateObjects');
        for (let i in app.objectList) {
            let item = app.objectList[i];

            // set visiblity 
            item.material.visible = item.visible;
            item.material.opacity = 1;
            item.material.emissive.setHex(0x000000);

            if (app.muscleGroupId !== null) {
                if (item.type === 'muscle') {
                    if (item.selected) {
                        item.material.opacity = 1;
                        item.material.emissive.setHex(0xFF0000);
                    }
                    else {
                        item.material.opacity = 0.2;
                        item.material.emissive.setHex(0x000000);
                    }
                }
                else {
                    item.transparent = true;
                    item.material.opacity = 0.2;
                }
            }
        }
    },

    toggleLeftMuscles: function () {
        console.log("toggleLeftMuscles", app.leftVisible);

        app.leftVisible = !app.leftVisible;

        if (app.muscleGroupId) {
            for (let i in app.objectList) {
                let item = app.objectList[i];
                for (let j in app.muscleIds) {
                    if (item.id === app.muscleIds[j] && item.side === 'left') {
                        item.visible = app.leftVisible;
                    }
                }
            }
        }
        else {
            for (let i in app.objectList) {
                let item = app.objectList[i];
                if (item.side === 'left') {
                    // console.log(item);
                    item.visible = app.leftVisible;
                }
            }
        }
        app.updateObjects();
    },
    toggleRightMuscles: function () {
        console.log("toggleRightMuscles", app.rightVisible);
        app.rightVisible = !app.rightVisible;

        if (app.muscleGroupId) {
            for (let i in app.objectList) {
                let item = app.objectList[i];
                for (let j in app.muscleIds) {
                    if (item.id === app.muscleIds[j] && item.side === 'right') {
                        item.visible = app.rightVisible;
                    }
                }
            }
        }
        else {
            for (let i in app.objectList) {
                let item = app.objectList[i];
                if (item.side === 'right') {
                    // console.log(item);
                    item.visible = app.rightVisible;
                }
            }
        }
        app.updateObjects();
    },
};







const initEventListeners = function () {
    window.addEventListener('resize', onResize);
    window.addEventListener('resize-end', onResizeEnd);

    window.addEventListener('click', app.clickStart);


    let btnReset = document.getElementById('btn-reset');
    let btnMenuOff = document.getElementById('btn-menu-off');
    let btnMenuOn = document.getElementById('btn-menu-on');
    let btnLeftMuscle = document.getElementById('btnLeftMuscle');
    let btnRightMuscle = document.getElementById('btnRightMuscle');

    let selectConditions = document.getElementById('navSelectConditions');
    let selectMuscles = document.getElementById('navSelectMuscles');



    btnReset.onclick = (event) => {
        event.preventDefault();


        app.reset();

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
    btnLeftMuscle.onclick = (event) => {
        event.preventDefault();
        app.toggleLeftMuscles();
        return false;
    }
    btnRightMuscle.onclick = (event) => {
        event.preventDefault();
        app.toggleRightMuscles();
        return false;
    }

    selectConditions.onchange = (event) => {
        console.log('selectCondition', event.target.value);

        app.resetSelectMuscle();
        let value = event.target.value !== '' ? Number(event.target.value) : null;
        app.selectCondition(value);
    }

    selectMuscles.onchange = (event) => {
        console.log('selectMuscles', event.target.value);

        let value = event.target.value !== '' ? Number(event.target.value) : null;
        app.selectMuscleGroup(value);
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
    if (app.renderer) {

        let width = window.innerWidth - 20;
        let height = (window.innerWidth <= 768 ? window.innerHeight - 60 : window.innerHeight - 60);

        const cameraPos = app.camera.position;
        app.camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 10000);
        app.camera.updateProjectionMatrix();
        app.camera.position.copy(cameraPos);

        const controlsTarget = app.controls ? app.controls.target : new THREE.Vector3(0, 0, 0);
        app.controls = new OrbitControls(app.camera, app.renderer.domElement)
        app.controls.target.copy(controlsTarget);
        app.controls.enableZoom = true;
        // app.controls.enableDamping = true
        // app.controls.dampingFactor = 0.25

        app.renderer.setSize(width, height);

        // app.controls.enableDamping = true
        // app.controls.dampingFactor = 0.25



        app.domRoot = document.getElementById('container');
        app.domRoot.innerHTML = '';
        app.domRoot.appendChild(app.renderer.domElement);
    }

};


// Data requests
const initThree = function () {
    let width = window.innerWidth - 20;
    let height = (window.innerWidth <= 768 ? window.innerHeight - 60 : window.innerHeight - 60);

    app.scene = new THREE.Scene();

   

    app.renderer = new THREE.WebGLRenderer();
    app.renderer.antialias = true;
    app.renderer.setPixelRatio(window.devicePixelRatio);
    app.renderer.setSize(width, height);


    app.domRoot = document.getElementById('container');
    app.domRoot.appendChild(app.renderer.domElement);

    app.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
    app.camera.position.y = 10;
    app.camera.position.z = 30;

    app.controls = new OrbitControls(app.camera, app.renderer.domElement)
    app.controls.target = new THREE.Vector3(0, 11, 0);
    // app.controls.enableDamping = true
    // app.controls.dampingFactor = 0.25
    app.controls.enableZoom = true
};

const initScene = function () {
    var light = new THREE.AmbientLight(0x404040); // soft white light
    app.scene.add(light);

    app.spotLight = new THREE.SpotLight(0xffffff, 1, 200, 10);
    app.spotLight.position.set(0, 5, 50);
    app.spotLight.update = (dt) => {
        let normal = new THREE.Vector3().copy(app.controls.target);

        normal.add(app.camera.position);
        normal.normalize();
        normal.multiplyScalar(50);
        // console.log(normal);

        let tar = new THREE.Vector3(0,0,0);

        app.spotLight.position.copy(tar.add(normal));
        // app.spotLight.position.copy(app.controls.target);
        app.spotLight.lookAt(app.controls.target);
    }
    app.scene.add(app.spotLight);

    let lightGeo = new THREE.BoxGeometry(1, 1, 1);
    let lightMat = new THREE.MeshPhongMaterial({ color: 0xFF0000, flatShading: true, wireframe: false, visible: false, transparent: true });
    app.lightCube = new THREE.Mesh(lightGeo, lightMat);
    app.lightCube.update = () => {
        app.lightCube.position.copy(app.spotLight.position);
    }
    app.scene.add(app.lightCube);
}

const initObjects = function () {
    let geometry = new THREE.BoxGeometry(1, 1, 1);
    let material = new THREE.MeshPhongMaterial({ color: 0xFF0000, flatShading: true, wireframe: false, visible: false, transparent: true });
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

        data.id = props.id;
        data.name = props.name;
        data.type = props.type;
        data.side = '';

        // visiblity / material options
        data.visible = true;

        if (props.name.toLowerCase().indexOf('left') !== -1) {
            data.side = 'left';
        }
        else if (props.name.toLowerCase().indexOf('right') !== -1) {
            data.side = 'right';
        }

        // debugger;
        // let meshObj = props.mesh.clone();
        // let obj = new THREE.Object3D();

        let texture = app.getTexture(props.texture);

        let obj = props.mesh.clone();
        obj.scale.copy(app.objectScale);
        let mesh = obj.children[0];
        // let material = new THREE.MeshPhongMaterial({ color: 0xFF0000, map: texture });
        let material = new THREE.MeshPhongMaterial({ map: texture, transparent: true, visible: true });

        obj.name = props.name;

        mesh.material = material;

        data.object = obj;
        // data.object.children.push(mesh);

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
    app.controls.update(app.clock.getDelta());

    const cameraPos = app.cameraLastPos ? app.cameraLastPos : new THREE.Vector3(0, 0, 0).copy(app.camera.position);
    const targetPos = new THREE.Vector3(0, 0, 0).copy(app.controls.target);


    if (cameraPos.distanceTo(targetPos) > 100) {
        // console.log(cameraPos, targetPos, cameraPos.distanceTo(targetPos));

        // let norm = cameraPos;
        // norm.normalize();
        // norm.multiplyScalar(100);
        // app.camera.position.copy(norm);

        app.camera.position.copy(cameraPos);
        if (cameraPos.distanceTo(targetPos) > 90) {
            let norm = cameraPos;
            norm.normalize();
            norm.multiplyScalar(90);
            app.camera.position.copy(norm);
        }
    }
    // if( cameraPos.distanceTo(targetPos) < 90 ) {
    //     app.controls.update(app.clock.getDelta());
    // }

    app.cameraLastPos = new THREE.Vector3(0, 0, 0).copy(app.camera.position);


    app.spotLight.update(app.clock.getDelta());
    app.lightCube.update();
}




app.initialize();

