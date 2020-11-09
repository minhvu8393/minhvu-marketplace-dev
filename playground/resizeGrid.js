function handleResizeGrid() {
    function resizeGridItem(item){
        let grid = document.getElementsByClassName("grid")[0]; // FOR GETTING VALUES
        let rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
        let rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
        let rowSpan = Math.ceil((item.querySelector('.content').getBoundingClientRect().height+rowGap)/(rowHeight+rowGap));
        item.style.gridRowEnd = "span "+rowSpan; // RESIZE HERE
     }       
    function resizeAllGridItems(){
        let allItems = document.getElementsByClassName("post");
        for(let x=0;x<allItems.length;x++){
           resizeGridItem(allItems[x]);
        }
    }
    let allItems = document.getElementsByClassName("post");
    for(let x=0;x<allItems.length;x++){
        imagesLoaded( allItems[x], resizeInstance);
    }
    function resizeInstance(instance){
        let item = instance.elements[0];
        resizeGridItem(item);
    }   
}

let allPosts = document.getElementsByClassName('posts__post');
            allPosts.forEach((post) => {
                imagesLoaded(post, (instance) => {
                    let item = instance.elements[0];
                    this.resizeSinglePost(item);
                })
            })