/* 内容管理对象 */

var H5 =function ( ) {
    this.id = ('h5_'+Math.random()).replace('.','_');
    this.el = $('<div class="h5" id="'+this.id+'">').hide();
    this.page = [];
    $('body').append( this.el );      //生成一个全屏滚动包裹div  并且先隐藏

    /**
     * 新增一个页
     * @param {string} name 组建的名称，会加入到ClassName中
     * @param {string} text 页内的默认文本
     * @return {H5} H5对象，可以重复使用H5对象支持的方法
     */
    this.addPage = function( name , text ){
        var page = $('<div class="h5_page section">');

        if( name != undefined ){/*每个页面的壳div的      类必须是   'h5_page_'+name*/
            page.addClass('h5_page_'+name);
        }
        if( text != undefined ){
            page.text(text);
        }
        this.el.append(page);
        this.page.push( page );//并且存入数组保存
        if( typeof this.whenAddPage === 'function' ){
            this.whenAddPage();
        }
        return this;
    }

    /* 新增一个组件 */
    this.addComponent = function(name, cfg){
        var cfg = cfg || {};
        cfg = $.extend({
             type : 'base'
         },cfg);

        var component;  //  定义一个变量，存储 组件元素
        var page = this.page.slice(-1)[0];//   page  里面存的是jquery对象，    slice(-1)  是从最后一个元素开始截取，即取最后一个元素，然后去dom节点
        switch( cfg.type ){
            case 'base' :
                component = new H5ComponentBase(name,cfg);
                break;

            case 'polyline' :
                component = new H5ComponentPolyline(name,cfg);
                break;

            case 'pie' :
                component = new H5ComponentPie(name,cfg);
                break;
            case 'bar' :
                component = new H5ComponentBar(name,cfg);
                break;
            case 'bar_v' :
                component = new H5ComponentBar_v(name,cfg);
                break;

            case 'radar' :
                component = new H5ComponentRadar(name,cfg);
                break;

            case 'pie' :
                component = new H5ComponentPie(name,cfg);
                break;
            case 'ring' :
                component = new H5ComponentRing(name,cfg);
                break;
           case 'point' :
                component = new H5ComponentPoint(name,cfg);
                break;
            default:
        }

        page.append(component);
        return this;
    }
    /* H5对象初始化呈现 */
    this.loader = function( firstPage ){
        this.el.fullpage({
            onLeave:function( index, nextIndex, direction) {
                $(this).find('.h5_component').trigger('onLeave');
            },
            afterLoad:function( anchorLink, index ) {
                $(this).find('.h5_component').trigger('onLoad');
            }
        });
        this.page[0].find('.h5_component').trigger('onLoad');
        this.el.show();
        if(firstPage){
            $.fn.fullpage.moveTo( firstPage );
        }
    }
    this.loader = typeof H5_loading == 'function' ? H5_loading : this.loader;
    return this;
}