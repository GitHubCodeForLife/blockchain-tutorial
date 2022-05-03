$(document).ready(function () {
  console.log("ready part 2");
  $("#login-form").submit(function (e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/api/login",
      data: $("#login-form").serialize(),
      success: function (response) {
        setTimeout(function () {
          window.location.href = "/";
        }, 1000);
        $("#login-form").hide();
        $("#result").append(`<div class="alert
alert-success"> <strong>Success!</strong> You have been login successfully</div> `);
      },
      error: function (response) {
        $("#result").append(`<div class="alert
alert-danger"> <strong>Error!</strong> ${response.responseJSON.message}
</div>`);
      },
    });
  });
});
