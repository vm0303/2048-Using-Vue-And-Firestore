const vScroll = {
    mounted: (el) => {
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => {
            const coordinates = el.getBoundingClientRect().top + window.scrollY; //(1)
            window.scroll({top: coordinates, behavior: 'smooth'});  //(2)
        });
    },
};

export default vScroll;