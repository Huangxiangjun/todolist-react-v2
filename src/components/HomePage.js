import React from "react";
import '../css/HomePage.css'
import dayjs from "dayjs"
import axios from "axios"

axios.defaults.baseURL = "http://localhost:3000/";

class HomePage extends React.Component {

    constructor() {
        super()
        this.textRef = React.createRef()
        this.selectRef = React.createRef()
        // this.selectClass = []
        this.state = {
            isSelectAll:true,
            todoList: [
                // {id:"1", isCheck:true, text:"123", time:"21-12-01 22:37"},
                // {id:"2", isCheck:true, text:"456", time:"21-15-11 22:37"},
            ],
        }

    }

    

    // 挂载
    async componentDidMount() {
        // 去获得数据
        // let getList = JSON.parse(window.localStorage.getItem('ListTodo'))

        // 用axios请求数据
        let {data} = await axios.get('/')
        let getList = data

        // let getData = () => {
        //     return new Promise((resolve,reject) => {
        //         axios.get('/').then(res => {
        //             console.log(res.data)
        //             resolve(res.data)
        //         })
        //     })
        // }
        // let getList2 = await getData()
        // console.log(1);
        // console.log(getList2);


        if(getList === null || !getList.length) {
            getList = [{
                id:this.getRandomId(), 
                isCheck:false, 
                text:"点击上方添加按钮添加事件", 
                time:dayjs(new Date).format("YY-MM-DD HH:mm"),
            }]

            this.setState({
                todoList: getList
            },() => {
                console.log(this.state.todoList)
                this.storage()
                // 首屏渲染全选按钮还是取消全选
                this.isSelectAllUpdate()
            })
        } else {
            this.setState({
                todoList: getList
            },() => {
                console.log(this.state.todoList);
                // 首屏渲染全选按钮还是取消全选
                this.isSelectAllUpdate()
            })
        }
    }

    // ------------------------基本功能------------------------------
    // 添加
    add = () => {
        let new_item = {
            id:this.getRandomId(),
            isCheck:false,
            text:"",
            time:dayjs(new Date).format("YYYY-MM-DD HH:mm:ss")
        }
        let new_todolist = this.state.todoList
        new_todolist.unshift(new_item)
        // console.log(new_todolist);
        this.setState({
            todoList:new_todolist
        },() => {
            // console.log(this.state.todoList);
            // console.log(this.textRef.current);
            this.textRef.current.focus()
        })

        // 添加到数据库
        this.post('/add', new_item)
    }

    // 删除
    del = (e) => {
        let del_id = e.target.name
        // console.log(del_id);
        let new_todolist = this.state.todoList
        new_todolist = new_todolist.filter(item => {
            return item.id !== del_id
        })
        // console.log(new_todolist);
        this.setState({
            todoList:new_todolist
        }, () => {
            this.storage()
        })

        // 去数据库删除
        this.post('/del', del_id)
    }

    // 选择或取消选择
    select = (e) => {
        // console.log(e.target.getAttribute("name"));
        let select_id = e.target.getAttribute("name")
        // console.log(select_id);
        let new_todolist = this.state.todoList
        let status = false
        new_todolist.forEach(item => {
            if(item.id === select_id) {
                console.log(item);
                item.isCheck = !item.isCheck
                status = item.isCheck
            }
        })
        this.setState({
            todoList:new_todolist
        }, () => {
            console.log(this.state.todoList);
            this.isSelectAllUpdate() // 判断是否已经被全选
            this.storage()
        })

        // 去数据库更新状态
        this.post('/changeStatus', {'isCheck':status, 'id':select_id})
    }

    // 全选
    selectAll = () => {
        let new_todolist = this.state.todoList
        new_todolist.forEach(item => {
            item.isCheck = true
        })
        this.setState({
            isSelectAll:true,// 是否全选的状态
            todoList:new_todolist
        }, () => {
            this.storage()
        })

        // 更新所有项目状态
        this.post('/selectAll', {'isCheck':true})
    }

    // 取消全选
    cancelAll = () => {
        let new_todolist = this.state.todoList
        new_todolist.forEach(item => {
            item.isCheck = false
        })
        this.setState({
            isSelectAll:false,// 是否全选的状态
            todoList:new_todolist
        }, () => {
            this.storage()
        })

        // 更新所有项目状态
        this.post('/cancelAll', {'isCheck':false})
    }

    // 修改
    textUpdate = (e) => {
        let update_id = e.target.name;
        let new_todolist = this.state.todoList
        new_todolist.forEach(item => {
            if(item.id === update_id) item.text = e.target.value
        })

        this.setState({
            todoList:new_todolist
        }, () => {
            // console.log(this.state.todoList);
        })
    }

    // 失焦判断保存
    textBlur = (e) => {
        // console.log(e.target.name);
        let blur_id = e.target.name
        let text = e.target.value
        console.log(1);
        console.log(text);
        let new_todolist = this.state.todoList
        new_todolist = new_todolist.filter(item => {
            return item.text !== ""
        })
        // console.log(new_todolist);
        this.setState({
            todoList:new_todolist
        }, () => {
            // console.log(this.state.todoList);
            this.storage()
        })

        // 如果内容为空，删去
        if(!text || text === "") this.post('/blurDel', blur_id)
        // 如果内容不为空，更新
        else this.post('/blurUpdate', {'text':text, 'id':blur_id})
    }

    // ------------------------封装功能------------------------------
    // 产生随机数作为id
    getRandomId = () => {
        return Number(Math.random().toString().substr(2,0) + Date.now()).toString(10)
    }

    // 把todoList存储到LocalStorage
    storage = () => {
        window.localStorage.setItem('ListTodo', JSON.stringify(this.state.todoList))
    }

    // 根据todoList更新state中isSelectAll属性
    isSelectAllUpdate = () => {
        this.setState({
            isSelectAll:true
        })
        if(!this.state.todoList.length) {
            this.setState({
                isSelectAll: false
            })
        }
        this.state.todoList.forEach(item => {
            if(!item.isCheck) {
                this.setState({
                    isSelectAll: false
                })
            }
        })
    }

    // 全选或取消全选按钮的显示
    selectBtn = (isSelectAll) => {
        if(isSelectAll) return (<button className="header-selectAll" onClick={this.cancelAll}>取消全选</button>)
        return (<button className="header-selectAll" onClick={this.selectAll}>全选</button>)
    }
    
    // 封装axios post请求
    post = (url, item) => {
        console.log(JSON.stringify(item));
        axios.post(url, JSON.stringify(item), {emulateJSON:true,' Content-Type':'application/json'})
        .then(res => console.log("请求发送成功:" + res), err => console.log("请求发送失败:" + err))
      }

    // // 项目选中状态与否
    // selectSpan = (isCheck) => {
    //     if(isCheck) return (<span></span>)
    //     return null
    // }
// ----------------------------------------------------------------
    render() {
        return (
            <div className="todoListBox">
                <div className="header-box">
                    <div className="header-left">
                        <div className="header-addicon">+</div>
                        <h2>愿望清单</h2>
                    </div>
                    <div className="header-right">
                        {this.selectBtn(this.state.isSelectAll)}
                        <button className="header-add" onClick={this.add}>添加</button>
                    </div>
                </div>

                <div className="content">
                    {
                        this.state.todoList.map((item,index) => {
                            return (
                                <div className="content-item" key={item.id}>

                                    <div className="content-left">
                                        {/* {this.selectSpan(item.isCheck)} */}
                                        <span className={item.isCheck?"":"span-hidden"} name={item.id} onClick={this.select}></span>
                                    </div>

                                    <input type="text" className={item.isCheck?"content-input line-through":"content-input"} ref={this.textRef} value={item.text} name={item.id} onChange={this.textUpdate} onBlur={this.textBlur}></input>

                                    <div className="content-right">
                                        <p>{item.time}</p>
                                        <button name={item.id} onClick={this.del}>删除</button>
                                    </div>

                                </div>
                            )
                        })
                    }
                </div>


            </div>
        )
    }
}


export default HomePage