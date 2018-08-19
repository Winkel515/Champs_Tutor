function redirectEdit() {
    var token = localStorage.getItem('token'); 
    pathName = jwt_decode(token)._id;
    location.href = `/editProfile`;
}