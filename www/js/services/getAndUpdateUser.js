angular.module('breadcrumb')
.factory('getUpdateUserFact', function ($rootScope, $http, $state, store) {
  const putUserInfo = (userIf, userData) =>
    $http({
      method: 'PUT',
      url: `${$rootScope.IP}/users/${userData.id}`,
      data: userIf,
      json: true,
      params: {
        access_token: store.get('access_token'),
      },
    })
    .then((res) => {
      store.set('user', res.data.data[0]);
      $state.go('app.dashboard', {}, { reload: true });
    })
    .catch((error) => {
      console.error(error);
    });

  const postUserInfo = userIf =>
    $http({
      method: 'POST',
      url: `${$rootScope.IP}/users`,
      data: userIf,
      json: true,
    })
    .then((res) => {
      store.set('access_token', res.data.data[0].access_token);
      store.set('user', res.data.data[0]);
      store.remove('email');
      $state.go('app.dashboard');
    })
    .catch((error) => {
      console.error(error);
    });

  const deleteUserInfo = userData =>
    $http({
      method: 'DELETE',
      url: `${$rootScope.IP}/users/${userData.id}?access_token=${store.get('access_token')}`,
      json: true,
    })
    .then(() => {
      store.remove('profile');
      store.remove('user');
      $state.go('start');
    });


  return (socialID, userInfo, deleteAcct) => {
    $http({
      method: 'GET',
      url: `${$rootScope.IP}/users`,
      json: true,
      params: {
        social_login: socialID,
      },
    })
    .then((response) => {
      const data = response.data.data[0];
      const pic = store.get('pic');
      userInfo.social_login = socialID;
      userInfo.password = socialID;
      if (pic && !userInfo.profile_picture) {
        userInfo.profile_picture = pic;
      }
      if (deleteAcct) {
        return deleteUserInfo(data);
      }
      return data ? putUserInfo(userInfo, data) : postUserInfo(userInfo);
    })
    .catch((error) => {
      console.error(error);
    });
  };
});
