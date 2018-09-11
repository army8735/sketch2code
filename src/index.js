import sketch from 'sketch';

export default function(context) {
  let selection = context.selection;
    if(selection.count() === 0) {
    sketch.UI.alert('Error', 'At lease a layer myst be selected!');
    return;
  }
}
