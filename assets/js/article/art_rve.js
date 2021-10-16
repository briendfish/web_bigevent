$(function() {
    var layer = layui.layer;
    var form = layui.form;

    initCate();
    // 初始化富文本编辑器
    initEditor();
    //定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/api/getbooks',
            success: function(res) {
                if (res.status !== 200) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 一定要记得，动态项 select 添加可选项，为了让 layui 能够监听到我们向里面加了一些可选项，我们在填充好以后一定要记得，调用 form.render() 方法，重新渲染一下表单结构
                form.render();
            }
        })
    }

    // 1.初始化图片裁剪器
    var $image = $('#image');
    // 2.裁剪选项   
    var options = {
        aspectRatio: 400 / 200,
        preview: '.img-preview'
    };
    // 3.初始化裁剪区域
    $image.cropper(options);

    // 为选择封面的按钮，绑定点击事件处理函数
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click();
    })

    // 监听 coverFile 的 change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
        // 获取文件的列表数组
        var files = e.target.files;
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的 url 地址
        var newImgURL = URL.createObjectURL(files[0]);
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') //销毁旧的裁剪区域
            .attr('src', newImgURL) //重新设置图片路径
            .cropper(options) //重新初始化裁剪区域
    })

    // 定义文章的发布状态
    var art_state = '已发布';
    // 为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function() {
        art_state = '草稿';
    })


    {
        // 为表单绑定 submit 事件
        // $('#form-pub').on('submit', function(e) {
        //     // 1.阻止表单默认提交行为
        //     e.preventDefault();
        //     // 2.基于 form 表单，快速创建一个 formDate 对象
        //     var fd = new FormData($(this)[0]);
        //     // 3.将文章的发布状态，存到 fd 中
        //     fd.append('state', art_state)

        //     fd.forEach(function(v, k) {
        //             console.log(k, v)
        //         })
        //         // 4.将封面裁剪过后的图片，输出为一个文件对象
        //     $image
        //         .cropper('getCropperCanvas', {
        //             // 创建一个 Canvas 画布
        //             width: 400,
        //             height: 200
        //         })
        //         .toBlob(function(blob) {
        //             // 将Canvas画布上的内容，转化为文件对象
        //             // 得到文件对象后，进行后续的操作
        //             // 5.将文件对象存储到 fd 中
        //             fd.append('cover_img', blob);
        //             // 6.发起 ajax 请求
        //             publishArticle(fd);
        //         })
        // })
    }

    // 改接口：为表单绑定 submit 事件
    $('#form-pub').on('submit', function(e) {
        // 1.阻止表单默认提交行为
        e.preventDefault();
        var data = {
            author: $('#form-pub [name=cate_id]').val(),
            bookname: $('#form-pub [name=title]').val(),
            publisher: $('#form-pub [name=content]').val()
        }

        publishArticle(data);
    })


    // 定义一个发布文章的方法
    function publishArticle(data) {
        $.ajax({
            method: 'POST',
            url: '/api/addbook',
            data: data,
            // data:fa,
            // 注意：如果向服务器提交的是formData格式的数据，必须添加以下两个配置项
            // contentType: false,
            // processData: false,
            success: function(res) {
                console.log(res);
                if (res.status !== 201) {
                    return layer.msg('修改文章失败！')
                }
                // 发布文章成功后，跳转到文章列表页面
                layer.msg('修改文章成功！')
                location.href = '/article/art_list.html'
            }
        })
    }
})