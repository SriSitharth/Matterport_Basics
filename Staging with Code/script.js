console.clear();
const showcase1 = document.getElementById('showcase-iframe1');
const showcaseWindow1 = showcase1.contentWindow;
let mpSdk;

const dropdown = document.getElementById('model_dropdown');

const models = [
    {
        url: "http://localhost:8080/model/roundChair/scene.gltf",
        scale: { x: 0.5, y: 0.5, z: 0.5 },
        position: { x: -2.5, y: 0, z: -1.5 }
    },
    {
        url: "http://localhost:8080/model/luke/glTF/luke.gltf",
        scale: { x: 1, y: 1, z: 1 },
        position: { x: -2.5, y: 0, z: -2.5 }
    },
    {
        url: "http://localhost:8080/model/couch/scene.gltf",
        scale: { x: 0.02, y: 0.02, z: 0.02 },
        position: { x: -5.5, y: 0, z: -5.5 }
    },
    {
        url: "http://localhost:8080/model/blueChair/scene.gltf",
        scale: { x: 1, y: 1, z: 1 },
        position: { x: -1.5, y: 0.5, z: -1.5 }
    },
    {
        url: "http://localhost:8080/model/2.gltf",
        scale: { x: 1, y: 1, z: 1 },
        position: { x: -5.5, y: 0, z: -3.5 }
    },
    {
        url: "http://localhost:8080/model/chair.gltf",
        scale: { x: 1, y: 1, z: 1 },
        position: { x: -5.5, y: -1, z: -1.5 }
    },
    {
        url: "http://localhost:8080/model/table.gltf",
        scale: { x: 1, y: 1, z: 1 },
        position: { x: -5.5, y: 0, z: -1.5 }
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
    dropdown.addEventListener('change', async () => {
        const selectedIndex = dropdown.value;
        loadModel(selectedIndex);
    });
});

async function loadModel(index) {
    const model = models[index];
    const [sceneObject] = await mpSdk.Scene.createObjects(1);
    const node = sceneObject.addNode();

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
    node.start();

    node.position.set(model.position.x,model.position.y,model.position.z);

    // if (model.rotationSpeed) {
    //     const tick = function () {
    //         requestAnimationFrame(tick);
    //         node.obj3D.rotation.y += model.rotationSpeed;
    //     };
    //     tick();
    // }

    const controlNode = sceneObject.addNode();
    controlNode.addComponent('mp.transformControls', {
        selection: node,
        mode: "rotate",
        showX: false,
        showZ: false,
    });
    controlNode.addComponent('mp.transformControls', {
        selection: node,
        mode: "translate",
        showY: false,
    });
    controlNode.start();

}