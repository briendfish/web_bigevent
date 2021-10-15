$(function() {
    // 调用 getUserInfo 获取用户信息
    getUserInfo();


    var layer = layui.layer;
    // 点击按钮退出功能
    $('#btnLogout').on('click', function() {
        // 提示用户是否确认退出
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' },
            function(index) {
                // do something
                // console.log('ok');
                // 1.清空本地存储 中的 token
                localStorage.removeItem('token');
                // 2.重新跳转到登录页面
                location.href = '/login.html';


                // 这是关闭 confirm 提问框
                layer.close(index);
            })
    })
})

// 获取用户基本信息 换了能用的接口
function getUserInfo() {
    var data = {
        bookname: '西游记',
        author: '吴承恩',
        publisher: '北京图书出版社'
    }
    $.ajax({
        method: 'GET',
        url: '/api/getbooks',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // }
        data: data,
        success: function(res) {
            console.log(res.data)
            if (res.status !== 200) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用 renderAvatar 渲染用户头像
            renderAvatar(res.data);
        },
        // 不论请求成功还是失败，最终都会调用 complete 回调函数
        // complete: function(res) {
        // console.log('执行了 complete 回调');
        // console.log(res);
        // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        // if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败') {
        // 1.强制清空 token
        // localStorage.removeItem('token');
        // 2.强制跳转到登录页面
        // location.href = '/login.html';
        // }
        // }
    })
}

// 渲染用户头像
function renderAvatar(user) {
    // 1.获取用户昵称
    var user = user[0];
    var name = user.author || user.username;
    // 2.设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 3.按需渲染用户的头像
    if (user.user_pic !== null) {
        // 3.1 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 3.2 渲染文本头像
        $('layui-nav-img').hide();
        var first = name[0].toUpperCase;
        $('.text-avater').html(first).show();
    }
}