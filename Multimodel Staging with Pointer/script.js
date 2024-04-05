console.clear();
const showcase1 = document.getElementById('showcase-iframe1');
const showcaseWindow1 = showcase1.contentWindow;
let mpSdk;
var button = document.getElementById('button');
var rotate_btn = document.getElementById('rotate_btn');
var move_btn = document.getElementById('move_btn');
var delete_btn = document.getElementById('delete_btn');
const matterport_dropdown = document.getElementById('matterport_dropdown');
const matterport = [{
    url: "sdk/showcase.html?m=Cns8qx3cG9v&play=1&applicationKey=p4ubmh4wzy0pseeh4tftn59db"
}, {
    url: "sdk/showcase.html?m=t7HN3amEt4f&play=1&applicationKey=p4ubmh4wzy0pseeh4tftn59db"
}, {
    url: "sdk/showcase.html?m=6uTfzPshjiC&play=1&applicationKey=p4ubmh4wzy0pseeh4tftn59db"
}, {
    url: "sdk/showcase.html?m=FXSKhHssyc3&play=1&applicationKey=p4ubmh4wzy0pseeh4tftn59db"
}, {
    url: "sdk/showcase.html?m=Kpq5NC8JmvJ&play=1&applicationKey=p4ubmh4wzy0pseeh4tftn59db"
}, {
    url: "sdk/showcase.html?m=ABM4KEGEnEg&play=1&applicationKey=p4ubmh4wzy0pseeh4tftn59db"
}, {
    url: "sdk/showcase.html?m=eEo1n2kcobF&play=1&applicationKey=p4ubmh4wzy0pseeh4tftn59db"
}]
matterport_dropdown.addEventListener('change', async () => {
    const matterportIndex = matterport_dropdown.value;
    showcase1.src = matterport[matterportIndex].url;
});
const model_dropdown = document.getElementById('model_dropdown');
const models = [
    {
        url: "http://localhost:8080/model/roundChair/scene.gltf",
        scale: { x: 0.5, y: 0.5, z: 0.5 }
    },
    {
        url: "http://localhost:8080/model/luke/glTF/luke.gltf",
        scale: { x: 1, y: 1, z: 1 }
    },
    {
        url: "http://localhost:8080/model/couch/scene.gltf",
        scale: { x: 0.02, y: 0.02, z: 0.02 }
    },
    {
        url: "http://localhost:8080/model/blueChair/scene.gltf",
        scale: { x: 1, y: 1, z: 1 }
    },
    {
        url: "http://localhost:8080/model/2.gltf",
        scale: { x: 1, y: 1, z: 1 }
    },
    {
        url: "http://localhost:8080/model/chair.gltf",
        scale: { x: 1, y: 1, z: 1 }
    },
    {
        url: "http://localhost:8080/model/table.gltf",
        scale: { x: 1, y: 1, z: 1 }
    }
];
showcase1.addEventListener('load', async function () {
    try {
        mpSdk = await showcaseWindow1.MP_SDK.connect(showcaseWindow1);
    }
    catch (e) {
        console.error(e);
        return;
    }
    model_dropdown.addEventListener('change', async () => {
        const selectedIndex = model_dropdown.value;
        const model = models[selectedIndex];
        const [sceneObject] = await mpSdk.Scene.createObjects(1);
        const node = sceneObject.addNode();
        let rotationStarted = false;
        let movementStarted = false;

        const initial = {
            url: model.url,
            visible: true,
            localScale: model.scale,
            localPosition: { x: 0, y: 0, z: 0 },
            localRotation: model.rotation || { x: 0, y: 0, z: 0 }
        };

        node.addComponent('mp.gltfLoader', initial);
        node.addComponent('mp.ambientLight');
        node.addComponent('mp.directionalLight');

        const rotateNode = sceneObject.addNode();
        rotateNode.addComponent('mp.transformControls', {
            selection: node,
            mode: "rotate",
            showX: false,
            showZ: false,
        });

        const moveNode = sceneObject.addNode();
        moveNode.addComponent('mp.transformControls', {
            selection: node,
            mode: "translate",
            showY: false,
        });

        var poseCache;
        mpSdk.Camera.pose.subscribe(function (pose) {
            poseCache = pose;
        });

        var intersectionCache;
        mpSdk.Pointer.intersection.subscribe(function (intersection) {
            intersectionCache = intersection;
            intersectionCache.time = new Date().getTime();
            button.style.display = 'none';
            buttonDisplayed = false;
        });

        var delayBeforeShow = 1000;
        var buttonDisplayed = false;
        setInterval(() => {
            if (!intersectionCache || !poseCache) {
                return;
            }

            const nextShow = intersectionCache.time + delayBeforeShow;
            if (new Date().getTime() > nextShow) {
                if (buttonDisplayed) {
                    return;
                }

                var size = {
                    w: showcase1.clientWidth,
                    h: showcase1.clientHeight,
                };
                var coord = mpSdk.Conversion.worldToScreen(intersectionCache.position, poseCache, size);
                button.style.left = `${coord.x - 15}px`;
                button.style.top = `${coord.y - 12}px`;
                button.style.display = 'block';
                buttonDisplayed = true;
            }
        }, 16);

        button.addEventListener('click', function (e) {
            node.position.set(intersectionCache.position.x, intersectionCache.position.y, intersectionCache.position.z);
            node.start();
            button.style.display = 'none';
            showcase1.focus();
        });

        rotate_btn.style.display = 'initial';
        move_btn.style.display = 'initial';
        delete_btn.style.display = 'initial';

        rotate_btn.addEventListener('click', function () {
            if (rotationStarted) {
                rotateNode.stop();
                rotationStarted = false;
            } else {
                rotateNode.start();
                rotationStarted = true;
            }
        });
        move_btn.addEventListener('click', function () {
            if(movementStarted){
                moveNode.stop();
                movementStarted = false;
            }else{
                moveNode.start();
                movementStarted = true;
            }
        });
        delete_btn.addEventListener('click', function () {
            node.stop();
            rotateNode.stop();
            moveNode.stop();
            rotate_btn.style.display = 'none';
            move_btn.style.display = 'none';
            delete_btn.style.display = 'none';
        });
    });
});