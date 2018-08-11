var token = localStorage.getItem('token');
var pathName;
if(token){
    pathName = jwt_decode(localStorage.getItem('token'))._id;
}

function redirectEdit() {
    location.href = `/editProfile/${pathName}`;
}