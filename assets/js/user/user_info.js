$(function() {
    var form = layui.form;
    var layer = layui.layer;

    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
                    // layui.layer.msg('')
            }
        }
    })

    initUserInfo();


    // 初始化用户的基本信息
    function initUserInfo() {
        var udata = {
            bookname: '三国演义'
        };
        $.ajax({
            method: 'GET',
            url: '/api/getbooks',
            data: udata,
            success: function(res) {
                if (res.status !== 200) {
                    return layer.msg('获取用户信息失败!')
                }
                console.log(res)
                var data = res.data[0];
                console.log(data)

                // 调用 form.val() 快速为表单赋值

                form.val('formUserInfo', data)
            }
        })
    }

    // 重置表单数据
    $('#btnReset').on('click', function(e) {
        // 阻止重置按钮默认行为
        e.preventDefault();
        // 重新初始化用户基本信息
        initUserInfo();
    })

    // 提交表单数据并修改文字头像
    // 监听表单的提交事件
    $('.layui-form').on('submit', function(e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        // 发送 ajax 请求
        $.ajax({
            method: 'POST',
            url: '/api/addbook',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 201) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功!')

                // 调用父页面中的方法，重新渲染用户的头像和用户信息
                window.parent.getgetUserInfo();
            }
        })
    })
})