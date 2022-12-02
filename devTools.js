const  el = document.createElement('div');
document.body.appendChild(el);
async function loadEruda(){
  await eruda.init({
    container:el,
    tools: ['console',"elements"],
    useShadowDom: true,
    autoScale: true,
    defaults:{
      displaySize: 50,
      transparency: 0.9,
      theme: 'Monokai Pro'
    }
  });
}
loadEruda();

