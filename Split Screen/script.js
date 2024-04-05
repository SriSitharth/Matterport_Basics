console.clear();
const showcase1 = document.getElementById('showcase-iframe1');
const showcase2 = document.getElementById('showcase-iframe2');
const showcaseWindow1 = showcase1.contentWindow;
const showcaseWindow2 = showcase2.contentWindow;
let mpSdk1, mpSdk2;
// let cachedPose1, cachedPose2;
// let syncEnabled1 = false;
// let syncEnabled2 = true;

showcase1.addEventListener('load', async function () {
    try {
        mpSdk1 = await showcaseWindow1.MP_SDK.connect(showcaseWindow1);
    }
    catch (e) {
        console.error(e);
        return;
    }
    // mpSdk1.on(mpSdk1.Sweep.Event.ENTER, function () {
    //     //moveScreen1();
    // });
    synchronizeScreens();
});

showcase2.addEventListener('load', async function () {
    try {
        mpSdk2 = await showcaseWindow2.MP_SDK.connect(showcaseWindow2);
    }
    catch (e) {
        console.error(e);
        return;
    }
    // mpSdk2.on(mpSdk2.Sweep.Event.ENTER, function () {
    //      //moveScreen2();   
    //  });
     synchronizeScreens();
});

let updatingScreen1 = false;
let updatingScreen2 = false;

function clonePose(pose) {
    return {
        ...pose,
        position: { ...pose.position },
        projection: [...pose.projection],
        rotation: { ...pose.rotation },
        sweep: pose.sweep.slice(),
    };
}

function synchronizeScreens() {
    mpSdk1.Camera.pose.subscribe(function (pose) {
        if (!updatingScreen1) {
            updatingScreen2 = true;
            const clonedPose = clonePose(pose);
            mpSdk2.Camera.setRotation({ x: clonedPose.rotation.x, y: clonedPose.rotation.y })
                .then(() => {
                    updatingScreen2 = false;
                })
                .catch((error) => {
                    console.error("Error updating rotation screen 2:", error);
                    updatingScreen2 = false;
                });

            mpSdk1.Sweep.current.subscribe(function (currentSweep) {
                mpSdk2.Sweep.moveTo(currentSweep.sid, { rotation: pose.rotation, transition: mpSdk2.Sweep.Transition.FLY, transitionTime: '800' });
            });
        }
    });

    mpSdk2.Camera.pose.subscribe(function (pose) {
        if (!updatingScreen2) {
            updatingScreen1 = true;
            const clonedPose = clonePose(pose);
            mpSdk1.Camera.setRotation({ x: clonedPose.rotation.x, y: clonedPose.rotation.y })
                .then(() => {
                    updatingScreen1 = false;
                })
                .catch((error) => {
                    console.error("Error updating screen 1:", error);
                    updatingScreen1 = false;
                });

            mpSdk2.Sweep.current.subscribe(function (currentSweep) {
                mpSdk1.Sweep.moveTo(currentSweep.sid, { rotation: pose.rotation, transition: mpSdk1.Sweep.Transition.FLY, transitionTime: '800' });
            });
        }
    });
}

// function moveScreen1() {
//     mpSdk1.Camera.pose.subscribe(function (pose) {
//         cachedPose1 = pose;
//         if (syncEnabled1) {
//             mpSdk2.Camera.setRotation({ x: pose.rotation.x, y: pose.rotation.y })
//         }
//     });
//     mpSdk1.Sweep.current.subscribe(function (currentSweep) {
//         if (syncEnabled1) {
//             mpSdk2.Sweep.moveTo(currentSweep.sid, { rotation: cachedPose1.rotation, transition: mpSdk2.Sweep.Transition.FLY, transitionTime: '1000' });
//         }
//     });
// }

// function moveScreen2() {
//     mpSdk2.Camera.pose.subscribe(function (pose) {
//         cachedPose2 = pose;
//         if (syncEnabled2) {
//             mpSdk1.Camera.setRotation({ x: pose.rotation.x, y: pose.rotation.y })
//         }
//     })
//     mpSdk2.Sweep.current.subscribe(function (currentSweep) {
//         if (syncEnabled2) {
//             mpSdk1.Sweep.moveTo(currentSweep.sid, { rotation: cachedPose2.rotation, transition: mpSdk1.Sweep.Transition.FLY, transitionTime: '1000' });
//         }
//     });
// }