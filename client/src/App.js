import './app.css';
import {useEffect, useState} from "react";
import Card from "./components/card/Card";
import Navbar from "./components/navbar/Navbar";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from 'yup';
import {posts} from "./data";
import io from 'socket.io-client';

const schema = yup.object().shape({
    username: yup.string().required(),
    email: yup.string().email(),
    /*age: yup.number().positive().integer(),*/
    password: yup.string(),
    /*password: yup.string().min(2),*/
    confirmPassword: yup.string().oneOf([yup.ref("password"), null]),
})

function App() {
    const [user, setUser] = useState();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        setSocket(io("http://localhost:5000"));
    }, []);

    useEffect(() => {
        socket?.emit("newUser", user);
    }, [socket, user]);

    const {register, handleSubmit, formState: {errors}, reset} = useForm({
        resolver: yupResolver(schema),
    });

    const formHandler = (data) => {
        setUser(data.username);
        reset();
    }

    return (
        <div className="container">
            {user ? (
                <>
                    <Navbar socket={socket}/>
                    {posts.map(post => (
                        <Card key={post.id} post={post} socket={socket} user={user}/>
                    ))}
                    <span className="username">{user}</span>
                </>
            ) : (
                <div className="login">
                    <h4>Sign up</h4>
                    <form onSubmit={handleSubmit(formHandler)}>
                        <input type="text"
                               placeholder="username"
                               name="username"
                               {...register("username")}
                        />
                        <p>{errors.username?.message}</p>

                        <input type="text"
                               placeholder="email"
                               name="email"
                               {...register("email")}
                        />
                        <p>{errors.email?.message}</p>

                        <input type="text"
                               placeholder="age"
                               name="age"
                               {...register("age")}
                        />
                        <p>{errors.age?.message}</p>

                        <input type="password"
                               placeholder="password"
                               name="password"
                               {...register("password")}
                        />
                        <p>{errors.password?.message}</p>

                        <input type="password"
                               placeholder="Confirm Password"
                               name="confirmPassword"
                               {...register("confirmPassword")}
                        />
                        <p>{errors.confirmPassword && "password didn't match"}</p>

                        <input type="submit" id="submit"/>
                    </form>
                </div>
            )}
        </div>
    );
}

export default App;
