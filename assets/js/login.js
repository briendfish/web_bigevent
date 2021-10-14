$(function() {
    // 点击“去注册账号”链接
    $("#link_reg").on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击“去登录”链接
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 从 layUI 中获取 form 对象
    var form = layui.form;
    var layer = layui.layer;
    // 通过 form.verify() 函数自定义校验规则 
    form.verify({
        // 自定义了一个叫做  pwd 的校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致的规则
        repwd: function(value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框的内容
            // 然后进行一次等于的判断
            // 如果判断失败，则return一个提示消息即可
            var pwd = $(' [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })

    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        // 发起Ajax的POST请求
        var data = { bookname: $('#form_reg [name=username]').val(), author: $('#form_reg [name=password]').val(), publisher: $('#form_reg [name=repassword]').val() }
        $.post('/api/addbook', data, function(res) {
            if (res.status !== 201) {
                return layer.msg('用户名已被占用，请登录其他用户名!');
                // return console.log(res.msg)
            }
            layer.msg('注册成功！请登录');
            // 模拟人的点击行为
            $('#link_login').click();
        })
    })

    // 监听登录表单的注册事件
    $('#form_login').on('submit', function(e) {
        e.preventDefault()
        var data = { bookname: $('#form_login [name=username]').val(), author: $('#form_login [name=password]').val(), publisher: $('#form_login [name=repassword]').val() };
        $.ajax({
            url: '/api/addbook',
            method: 'POST',
            data: data,
            success: function(res) {
                console.log(res);
                if (res.status !== 201) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                console.log(res.status)

                // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })


})