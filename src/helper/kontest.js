import axios from "axios";

const API_BAS_URL = "http://localhost:8080/";

const axiosInstance = axios.create();

const KontestService = {
    getAll : async () =>{
        return await axiosInstance.get(`${API_BAS_URL}get/all`)
        .then(function onFulfilled(response){
            console.log("Successfully fetched data")
            return response
        },function onRejected(err){
            console.log("Something went wrong while trying to access the api")
            return err;
        })
        
    }
}

export default KontestService