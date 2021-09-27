const alerts = () => {
    const $ = require('jquery')
    console.log('alert');
    //alert('alert')
    let x = document.querySelector('body');
    console.log(x);
    console.log('hello');
    //confirm('sdd')
   console.log( $('.nav'));
   $('.nav').fadeOut('slow');
}

export default alerts
