console.clear();
const showcase1 = document.getElementById('showcase-iframe1');
const showcaseWindow1 = showcase1.contentWindow;
let mpSdk;



var mattertags = [{
    label: 'Pot',
    description: '[Link to Buy](https://www.amazon.in/Nurturing-Green-Watering-Drainage-Included/dp/B0BGXLKG7W?ref_=Oct_d_otopr_d_3639058031_2&pd_rd_w=sGriD&content-id=amzn1.sym.8757fa58-5cec-4cc2-9619-0837e3091dfd&pf_rd_p=8757fa58-5cec-4cc2-9619-0837e3091dfd&pf_rd_r=32SCGX6X9Z63EJQRGMTY&pd_rd_wg=nEcZG&pd_rd_r=8294c8db-fa4a-436a-ad6c-f2a70607ad5c&pd_rd_i=B0BGXLKG7W)',
    anchorPosition: { x: 0.478, y: 0.974, z: -1.039 },
    stemVector: { x: 0, y: 0.3, z: 0 },
    color: {r:1,g:1,b:0}
}, {
    label: 'Couch',
    description: '[Buy at $400](https://www.samsung.com/in/refrigerators/double-door/rt3500mh-digital-inverter-technology-236l-silver-rt28c3922s9-hl/?cid=in_pd_ppc_google_ce-samsungref-doubledoor-ref-dtc_sales_samsung-ref-all-2023_eshop-pmax-pla_01jan2023-na_1ur-501463l-2024-eshop-bau-ce-performancemax-cpc_pfm--18576154286------x--RT28C3922S9%2FHL&gad_source=1&gclid=EAIaIQobChMIsNWMsd34hAMVGNMWBR2FVwGjEAQYAiABEgITj_D_BwE)',
    anchorPosition: { x: 3.033, y: 0.555, z: 2.916 },
    stemVector: { x: 0, y: 0, z: -0.1 },
    color: {r:0,g:1,b:0}
},{
    label: 'Door',
    description: '[Link to Product](https://www.amazon.in/NATURES-purifier-Technology-Electric-Purifier/dp/B0CPT6LT6C/ref=sr_1_16?crid=3C5Z1W0QY1Z32&dib=eyJ2IjoiMSJ9.Bcm4jGN811KIVpvR_b-M7djoglRg3U8JBVp1BgMZvEqtfOXuwcxoOJTglXwO2DjzcoYUFYvp2cYjv8J8y9jhHA9Tv4zK42QT5YB3pE62VKTY8vrUC94I5T7Zn16xIEtR0Bd64Sf6iNGe89_JjC-z9mXR5yQvYTn-z5JXx0iqKIRS0KnmpmxQFGtHyRQI52egHXpBEEjxMKnxzLFvspc3vZ887hDQgP8qi5n3J7tAwrU.mS8tkWZa8KEQKbdsDQThy3bnwePzwLsJBImhtuc13kc&dib_tag=se&keywords=water+purifier+for+home&qid=1710589330&s=kitchen&sprefix=water+pur%2Ckitchen%2C220&sr=1-16)',
    anchorPosition: { x: 0.017, y: 1.205, z: 3.747 },
    stemVector: { x: 0, y: 0, z: -0.2 },
    color: {r:1,g:0,b:0}
},{
    label: 'Dust Bin',
    description: 'Buy at $3',
    anchorPosition: { x: -0.992, y: 0.301, z: 3.474 },
    stemVector: { x: 0, y: 0.2, z: 0 },
    color: {r:0,g:0,b:1}
}];

showcase1.addEventListener('load', async function () {
    try {
        mpSdk = await showcaseWindow1.MP_SDK.connect(showcaseWindow1);
    }
    catch (e) {
        console.error(e);
        return;
    }

    //mpSdk.obj3D.position.set(0,-1,0);
    console.log('mpSdk obj 3D',mpSdk,mpSdk.Mode.current);

    mpSdk.Mattertag.add(mattertags).then(function (mattertagIds) {
        console.log(mattertagIds);

        mpSdk.Mattertag.editBillboard(mattertagIds[0],{
            media: {
                type: mpSdk.Mattertag.MediaType.RICH,
                src: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            }
        });

        mpSdk.Mattertag.editBillboard(mattertagIds[1],{
            media: {
                type: mpSdk.Mattertag.MediaType.VIDEO,
                src: 'https://www.youtube.com/watch?v=WQWVW4DUmZ0',
            }
        });
        mpSdk.Mattertag.editBillboard(mattertagIds[2],{
            media: {
                type: mpSdk.Mattertag.MediaType.VIDEO,
                src: 'https://www.youtube.com/watch?v=CkNZ5xOaCcE',
            }
        });
        mpSdk.Mattertag.editBillboard(mattertagIds[3],{
            media: {
                type: mpSdk.Mattertag.MediaType.PHOTO,
                src: 'https://everydaysure.in/water/assets/media/bisleri-1ltr.jpg',
            }
        });

        // const id= mattertagIds[1];
        // mpSdk.Tag.attach(mattertagIds[1],mpSdk.PDF,'https://www.clickdimensions.com/links/TestPDFfile.pdf' );
    
    });
    
});