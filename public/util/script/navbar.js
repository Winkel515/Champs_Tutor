const pathName = jwt_decode(localStorage.getItem('token'))._id;

function redirectEdit() {
    location.href = `/editProfile/${pathName}`;
}