$("document").ready(function () {
  $("#btn-mine").click(function () {
    $.ajax({
      url: "/api/mine-transactions",
      success: function (data) {
        alert("Mining successfully!");

        location.reload();
      },
      error: function (data) {
        console.log(data);
        alert(data.responseJSON.message);
      },
    });
  });

  $("#send-form").submit(function (e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "/api/transact",
      data: $("#send-form").serialize(),
      success: function (response) {
        setTimeout(function () {
          location.reload();
        }, 1000);
        $("#myModal").modal("hide");
        $("#result").append(
          `<div class="alert alert-success"> <strong>Success!</strong>
          You have been send Coin successfully </div> `
        );
      },
      error: function (response) {
        $("#myModal").modal("hide");
        $("#result").append(
          `<div class="alert alert-danger"> <strong>Error!</strong>
          ${response.responseJSON.message} </div>`
        );
      },
    });
  });
});
