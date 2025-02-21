<?php

defined("BASEPATH") or exit("No direct script access allowed");

class Transportation extends MIK_Controller
{
  /**
   * Index Page for this controller.
   *
   * Maps to the following URL
   *      http://example.com/index.php/welcome
   *  - or -
   *      http://example.com/index.php/welcome/index
   *  - or -
   * Since this controller is set as the default controller in
   * config/routes.php, it's displayed at http://example.com/
   *
   * So any other public methods not prefixed with an underscore will
   * map to /index.php/welcome/<method_name>
   * @see https://codeigniter.com/user_guide/general/urls.html
   */
  function __construct()
  {
    parent::__construct();
    $this->load->config("paypal-sample");
    $this->load->model("Email_model");
    $config = [
      "Sandbox" => $this->config->item("Sandbox"), // Sandbox / testing mode option.
      "APIUsername" => $this->config->item("APIUsername"), // PayPal API username of the API caller
      "APIPassword" => $this->config->item("APIPassword"), // PayPal API password of the API caller
      "APISignature" => $this->config->item("APISignature"), // PayPal API signature of the API caller
      "APISubject" => "", // PayPal API subject (email address of 3rd party user that has granted API permission for your app)
      "APIVersion" => $this->config->item("APIVersion"), // API version you'd like to use for your call.  You can set a default version in the class and leave this blank if you want.
      "DeviceID" => $this->config->item("DeviceID"),
      "ApplicationID" => $this->config->item("ApplicationID"),
      "DeveloperEmailAccount" => $this->config->item("DeveloperEmailAccount"),
    ];

    // Show Errors
    if ($config["Sandbox"]) {
      error_reporting(E_ALL);
      ini_set("display_errors", "1");
    }

    // Load PayPal library
    $this->load->library("paypal/paypal_pro", $config);
  }

  public function index()
  {
    $data = [];
    $data["mo"] = "private-transport";

    $this->load->view("index", $data);
  }

  public function paymentMethods()
  {
    $data = [];
    $data["mo"] = "payment-decision";
    $data["dbHotels"] = $this->Commonmodel->get_data(
      "hotels",
      "status = '1'",
      "*",
      "name asc"
    );
    $data["info"] = [];
    $this->load->view("index", $data);
  }

  public function privateTransportation()
  {
    $data = [];
    $data["mo"] = "private-transport";
    $data["dbHotels"] = $this->Commonmodel->get_data(
      "hotels",
      "status = '1'",
      "*",
      "name asc"
    );
    $data["info"] = [];
    $this->load->view("index", $data);
  }
  public function privateTransportationTest()
  {
    $data = [];
    $data["mo"] = "private-transport";
    $data["dbHotels"] = $this->Commonmodel->get_data(
      "hotels",
      "status = '1'",
      "*",
      "name asc"
    );
    $data["info"] = [];
    $this->load->view("index", $data);
  }

  public function caboShuttle()
  {
    //redirect(BOOKING_DOMAIN_URL.'cabo-shuttle');
    $data = [];
    $data["mo"] = "cabo-shuttle";
    $data["dbHotels"] = $this->Commonmodel->get_data(
      "hotels",
      "status = '1' and FIND_IN_SET(`id`,(select group_concat(hotels SEPARATOR ',') from hotelgroups where type = 'cabo_shuttle'))",
      "*",
      "name asc"
    );

    $data["info"] = [];
    $this->load->view("index", $data);
  }

  public function caboShuttleTest()
  {
    $data = [];
    $data["mo"] = "cabo-shuttle";
    $data["dbHotels"] = $this->Commonmodel->get_data(
      "hotels",
      "status = '1' and FIND_IN_SET(`id`,(select group_concat(hotels SEPARATOR ',') from hotelgroups where type = 'cabo_shuttle'))",
      "*",
      "name asc"
    );

    $data["info"] = [];
    $this->load->view("index", $data);
  }

  public function getCost()
  {
    $data = [];
    $mstatus = 200;
    $message = "";
    $type = "private_transport";
    if ($_POST && count($_POST) > 0) {
      extract($_POST);

      $data["cost"] = 0;
      $c = 0;
      $rules["passengers"] = ["passengers", "required"];
      $rules["hotelId"] = ["hotel", "required"];
      $rules["service"] = ["type of service", "required"];
      $this->Commonmodel->setFormsValidation($rules);
      if ($this->form_validation->run() == true) {
        if ($type == "private_transport") {
          $field =
            "cost_" . $service . "_" . str_replace("-", "_", $passengers);
        } else {
          $field = "cost_" . $service . "_1_5";
        }

        $cost = $this->Commonmodel->get_table_field(
          "hotelgroups",
          "find_in_set('$hotelId',hotels) != 0 and type = '$type'",
          $field
        );
        $data["q"] = $this->db->last_query();
        if ($type != "private_transport") {
          $cost = $cost * $passengers;
        }
        $cdate = date("Y-m-d");
        $dbCoup = $this->Commonmodel->get_single_data(
          "coupon",
          "status = '1' and code = '$couponCode'",
          "*"
        );
        // if (count($dbCoup) > 0) {
        //     $couponCost = $dbCoup['discountCost'];
        //     $couponCost = ($dbCoup['type'] == 'price') ? $couponCost : ($dbCoup['discountCost'] * $cost) / 100;
        //     $cost = $cost - $couponCost;
        // }
        if (isset($arrivalDate) && !empty($arrivalDate)) {
          $arrivalDates = explode(" ", $arrivalDate);
          $adate = convertDate($arrivalDates[0], "d/m/Y", "Y-m-d");
          $data["adate"] = $arrivalDates;
          $atime = date(
            "H:i",
            strtotime($arrivalDates[1] . " " . $arrivalDates[2])
          );
          $data["atime"] = $atime;
          $day = date("l", strtotime($adate));
          $dbArr = $this->Commonmodel->get_single_data(
            "discount",
            "day = '$day' and  '$atime' between fromTime and toTime and type = '$type' and status = 1",
            "discount"
          );
          $data["aq"] = $this->db->last_query();
          $data["discount"] = 0;
          if (count($dbArr) > 0) {
            $dis = $dbArr["discount"];
            $data["discount"] = round(($dis * $cost) / 100, 2);
            $cost = $cost - $data["discount"];
          }
        }
        $data["cost"] = $cost ? $cost : 0;
      } else {
        $mstatus = 201;
        $message = strip_tags(validation_errors());
      }
    } else {
      $mstatus = 201;
      $message = "Params are invalid.Please try again";
    }
    $data["mstatus"] = $mstatus;
    $data["cost"] = round($data["cost"], 2);
    $data["message"] = $message;
    echo json_encode($data);
  }

  public function cardPayment()
  {
    require_once "application/libraries/stripe/init.php";

    \Stripe\Stripe::setApiKey($this->config->item("stripe_secret"));
    header("Content-Type: application/json");

    $YOUR_DOMAIN = "https://www.insideloscabos.com/payment-method";

    $data = [];
    $mstatus = "success";
    $message = "";
    $errormsg = "";
    $type = "private_transport";
    if ($_POST && count($_POST) > 0) {
      extract($this->input->post("info", true));
      $info = $this->input->post("info", true);
      $u =
        $type == "private_transport"
          ? "private-transportation"
          : "cabo-shuttle";
      $mo = $type == "private_transport" ? "private-transport" : "cabo-shuttle";
      if (!empty($hotelId)) {
        $c = $this->Commonmodel->get_count("hotels", "id = '" . $hotelId . "'");
        if ($c == 0) {
          redirect("/");
        }
      }
      $c = 0;
      $couponCost = 0;
      $coupon_code = @$_POST["info"]["coupon_code"];
      $coupon_discount = @$_POST["info"]["coupon_discount"];
      $rules["info[name]"] = ["name", "required|min_length[5]"];
      $rules["info[email]"] = ["email", "required|valid_email"];
      $rules["info[phone]"] = ["phone no", "required|numeric"];
      $rules["info[passengers]"] = ["passengers", "required"];
      $rules["info[hotelId]"] = ["hotel", "required"];
      $rules["info[service]"] = ["type of service", "required"];
      if ($info["type"] == "private_transport") {
        $rules["info[adults]"] = ["no of adults", "required|numeric"];
        $rules["info[kids]"] = ["no of kids", "required|numeric"];
      }

      $rules["info[arrivalDate]"] = ["arrival date", "required"];
      $rules["info[arrivalFlight]"] = ["arrival flight detail", "required"];
      if ($info["service"] == "round_trip") {
        $rules["info[departureDate]"] = ["departure date", "required"];
        $rules["info[departureFlight]"] = [
          "departure flight detail",
          "required",
        ];
      }

      $rules["info[comments]"] = ["comments", "required"];
      $this->Commonmodel->setFormsValidation($rules);

      if ($this->form_validation->run() == true) {
        $info = $this->input->post("info", true);
        if ($type == "private_transport") {
          $field =
            "cost_" . $service . "_" . str_replace("-", "_", $passengers);
        } else {
          $field = "cost_" . $service . "_1_5";
        }

        $cost = $this->Commonmodel->get_table_field(
          "hotelgroups",
          "find_in_set('$hotelId',hotels) != 0  and type = '$type'",
          $field
        );

        if ($type != "private_transport") {
          $cost = $cost * $passengers;
        }
        $cost = $cost ? $cost : 0;
        $info["calculateAmt"] = $cost;
        $info["couponCode"] = "";
        $cdate = date("Y-m-d");

        if (isset($arrivalDate) && !empty($arrivalDate)) {
          $arrivalDates = explode(" ", $arrivalDate);
          $adate = convertDate($arrivalDates[0], "d/m/Y", "Y-m-d");
          $atime = date(
            "H:i",
            strtotime($arrivalDates[1] . " " . $arrivalDates[2])
          );
          $info["arrivalDate"] = $arrivalDate = $adate . " " . $atime;

          if ($info["service"] == "round_trip") {
            $departureDates = explode(" ", $departureDate);
            $ddate = convertDate($departureDates[0], "d/m/Y", "Y-m-d");
            $dtime = date(
              "H:i",
              strtotime($departureDates[1] . " " . $departureDates[2])
            );
            $info["departureDate"] = $departureDate = $ddate . " " . $dtime;
          }
          $day = date("l", strtotime($adate));

          $dbArr = $this->Commonmodel->get_single_data(
            "discount",
            "day = '$day' and  '$atime' between fromTime and toTime and type = '$type'",
            "discount"
          );
          if (count($dbArr) > 0 && empty($coupon_code)) {
            $info["discount"] = $dis = $dbArr["discount"];
            $info["discountCost"] = round(($dis * $cost) / 100, 2);

            $cost = $cost - round(($dis * $cost) / 100, 2);
          }
        }

        $info["finalAmount"] = $cost;

        if ($cost != 0) {
          // CALL PAYMENT HERE

          $this->session->set_userdata("bookData", $info);

          $checkout_session = \Stripe\Checkout\Session::create([
            "payment_method_types" => ["card"],
            "line_items" => [
              [
                "price_data" => [
                  "currency" => "usd",
                  "unit_amount" => $cost * 100,
                  "product_data" => [
                    "name" => SITE_NAME,
                    "images" => [base_url("assets/img/logo.png")],
                  ],
                ],
                "quantity" => 1,
              ],
            ],
            "mode" => "payment",
            "success_url" =>
              "https://www.insideloscabos.com/transportation/bookingPaymentSuccess",
            "cancel_url" =>
              "https://www.insideloscabos.com/transportation/BookingCancelled",
          ]);
          header("HTTP/1.1 303 See Other");
          header("Location: " . $checkout_session->url);
        }
      } else {
        $message = "Some parameters are missing or not valid";
        $mstatus = "error";
      }
    } else {
      $message = "Params are invalid.Please try again";
      $mstatus = "error";

      redirect("/" . $u);
    }
    $data["msg"] = $message;
    $data["mstatus"] = $mstatus;
    $data["info"] = [];
    if ($mstatus == "error") {
      $data["info"] = $_POST["info"];
    }
    $data["mo"] = $mo;
    $data["dbHotels"] = $this->Commonmodel->get_data(
      "hotels",
      "status = '1'",
      "*"
    );

    $this->load->view("index", $data);
  }

  public function bookingPaymentSuccess()
  {
    $info = $this->session->userdata("bookData");
    $info["createdAt"] = date("Y-m-d H:i:s");
    $info["bookingId"] = "BOOK-" . random_string(8);
    $info["service"] = str_replace("_", " ", $info["service"]);
    $info["bookStatus"] = "booked";
    $info["payStatus"] = "paid";
    $info["transactionId"] = "Stripe";
    unset($info["coupon_discount"], $info["coupon_code"]);

    $o = $this->Commonmodel->save_data("booking", $info);

    try {
      extract($info);
      $hotelName = $this->Commonmodel->get_table_field(
        "hotels",
        "id = '" . $info["hotelId"] . "'",
        "name"
      );
      $to = FROM_PAYPAL_EMAIL;
      $t =
        $type == "private_transport"
          ? "Private Transportation"
          : "Cabo Shuttle";
      $subject =
        "A user has made a booking with " . SITE_NAME . " for " . $t . ".";
      $msgBody = "<html><body>";
      $msgBody .=
        '<img src="' .
        site_url("assets/img/newlogo.jpg") .
        '" alt="Insideloscabos" />';
      $userMsgBody = $msgBody;
      $msgBody .=
        "<div><strong>Dear Admin,</strong><br/>A user - " .
        $info["name"] .
        " has made a booking for hotel - " .
        $hotelName .
        " for " .
        $t .
        " with us. Please check the following booking details</div>";
      $userMsgBody .=
        "<div><strong>Dear " .
        $info["name"] .
        ",</strong><br/>Your booking has been done successfully for hotel - " .
        $hotelName .
        " for " .
        $t .
        " with " .
        SITE_NAME .
        ". Please check the following booking details</div>";
      $tableBody =
        '<p>You have successfully booked for Private Transportation- Our confirmation system will send you an email from: <a href="mailto:no_reply@insideloscabos.com">no_reply@insideloscabos.com</a> with your confirmation transportation voucher with all details and map, please be aware that some Antivirus send our email to the Spam!</p><br/></br>';
      $tableBody .=
        '<table rules="all" style="border-color: #666;" cellpadding="10">';
      $tableBody .= "<tr><td><strong>Paypal Transaction Id:</strong> </td><td>" .
        strip_tags($info["transactionId"]) .
        "</td></tr>";

      $tableBody .= "<tr><td><strong>Booking Date:</strong> </td><td>" .
        date("d/m/Y", strtotime($info["createdAt"])) .
        "</td></tr>";
      $tableBody .= "<tr style='background: #eee;'><td><strong>Name:</strong> </td><td>" .
        strip_tags($info["name"]) .
        "</td></tr>";
      $tableBody .= "<tr><td><strong>Email:</strong> </td><td>" .
        strip_tags($info["email"]) .
        "</td></tr>";
      $tableBody .= "<tr><td><strong>Phone:</strong> </td><td>" .
        strip_tags($info["phone"]) .
        "</td></tr>";
      $tableBody .= "<tr><td><strong>Passengers:</strong> </td><td>" .
        strip_tags($info["passengers"]) .
        "</td></tr>";
      $tableBody .= "<tr><td><strong>Hotel:</strong> </td><td>" .
        $hotelName .
        "</td></tr>";
      $tableBody .= "<tr><td><strong>Type Of Services:</strong> </td><td>" .
        $info["service"] .
        "</td></tr>";
      $tableBody .= "<tr><td><strong>Arrival Date:</strong> </td><td>" .
        strip_tags($info["arrivalDate"]) .
        "</td></tr>";
      $tableBody .= "<tr><td><strong>Arrival Flight Info: Airline, Flight Number and Time:</strong> </td><td>" .
        strip_tags($info["arrivalFlight"]) .
        "</td></tr>";
      if ($info["service"] == "round trip") {
        $tableBody .= "<tr><td><strong>Departure Date:</strong> </td><td>" .
          strip_tags($info["departureDate"]) .
          "</td></tr>";
        $tableBody .= "<tr><td><strong>Departure Flight Info: Airline, Flight Number and Time:</strong> </td><td>" .
          strip_tags($info["departureFlight"]) .
          "</td></tr>";
      }
      if ($type == "private_transport") {
        $tableBody .= "<tr><td><strong>Adults:</strong> </td><td>" .
          strip_tags($info["adults"]) .
          "</td></tr>";
        $tableBody .= "<tr><td><strong>Kids:</strong> </td><td>" .
          strip_tags($info["kids"]) .
          "</td></tr>";
      }
      $tableBody .= "<tr><td><strong>Comments:</strong> </td><td>" .
        htmlentities($info["comments"]) .
        "</td></tr>";
      if (!empty($info["couponCode"])) {
        $tableBody .= "<tr><td><strong>Coupon Code:</strong> </td><td>" .
          strip_tags($info["couponCode"]) .
          "</td></tr>";
        $tableBody .= "<tr><td><strong>Coupon Cost:</strong> </td><td>$" .
          strip_tags($info["couponAmount"]) .
          "</td></tr>";
      }
      if (!empty($info["discount"])) {
        $tableBody .= "<tr><td><strong>Discount:</strong> </td><td>" .
          strip_tags($info["discount"]) .
          " %</td></tr>";
        $tableBody .= "<tr><td><strong>Discount Cost:</strong> </td><td>$" .
          strip_tags($info["discountCost"]) .
          " </td></tr>";
      }
      $tableBody .= "<tr><td><strong>Booking Amount:</strong> </td><td>$ " .
        strip_tags($info["finalAmount"]) .
        "</td></tr>";
      $tableBody .= "<tr><td><strong>Booking Status:</strong> </td><td>" .
        strip_tags($info["bookStatus"]) .
        "</td></tr>";
      if (!empty($info["festiveCouponCode"])) {
        $tableBody .= "<tr><td><strong>Coupon Code:</strong> </td><td>" .
          strip_tags($info["festiveCouponCode"]) .
          "</td></tr>";
      }
      $tableBody .= "<tr style='background: #eee;'><td><strong>Booking Id:</strong> </td><td>" .
        strip_tags($info["bookingId"]) .
        "</td></tr>";
      $tableBody .= "</table><br>";
      $tableBody .= "<div>You will receive your confirmation transportation voucher from: no_reply@insideloscabos.com</div>";
      $tableBody .= "<br><div>Regards,<br><br>";
      $tableBody .= "<strong>" . SITE_NAME . "</strong><br><br>";
      $tableBody .= '<img src="' . site_url("assets/img/newlogo.jpg") . '" alt="Insideloscabos" />';
      $tableBody .= "</body></html></br>";
      $tableBody .= "<p>How to find us at Los Cabos Airport:</p></br>";
      $tableBody .= '<p>How to find us at Terminal 1: Go to the sign that says "Group Exits"</p></br></br>';
      $tableBody .= "<p>How to find us at Terminal 2 & 3:</p></br>";
      $tableBody .= '<p>As soon as you pass customs, go all the way "OUTSIDE" the building where all the transportation companies are. There you will find your Airport Rep with the sign, he is under the tent number 6.</p></br>';
      $msgBody .= $tableBody;
      $userMsgBody .= $tableBody;

      $headers = "MIME-Version: 1.0" . "\r\n";
      $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
      $headers .= "Content-Transfer-Encoding: 8bit" . "\r\n";

      log_message('debug', 'Admin Email Content: ' . $msgBody);
      log_message('debug', 'User Email Content: ' . $userMsgBody);

      $o = $this->Email_model->sendEmail(
        $to,
        $subject,
        $msgBody,
        [
          "http://reservations.impalacabo.com/assets/img/Terminal1.jpg",
          "http://reservations.impalacabo.com/assets/img/Terminal2.jpg",
        ],
        FROM_EMAIL,
        FROM_NAME,
        $headers
      );

      $userTo = $info["email"];
      $usersubject =
        SITE_NAME . " - Your booking has been made successfully with $t.";

      $o = $this->Email_model->sendEmail(
        $userTo,
        $usersubject,
        $userMsgBody,
        [
          "http://reservations.impalacabo.com/assets/img/Terminal1.jpg",
          "http://reservations.impalacabo.com/assets/img/Terminal2.jpg",
        ],
        FROM_EMAIL,
        FROM_NAME,
        $headers
      );
    } catch (Exception $ex) {
      echo "<pre>" . print_r($ex, true) . "</pre>";
      exit();
    }

    $this->Commonmodel->update_data("booking", $info, "id = '$id'");

    $bookId = base64_encode($info["bookingId"]);

    redirect(
      "https://www.insideloscabos.com/transportation/BookingComplete?bookingId=" .
        $bookId
    );
  }

  public function bookingPaymentSuccess2()
  {
    // Datos predefinidos para testear
    $info = [
      "name" => "John Doe",
      "email" => "johndoe@example.com",
      "phone" => "1234567890",
      "passengers" => 2,
      "hotelId" => 1,
      "service" => "private_transport",
      "arrivalDate" => "2023-12-01",
      "arrivalFlight" => "Flight 123",
      "departureDate" => "2023-12-10",
      "departureFlight" => "Flight 456",
      "adults" => 2,
      "kids" => 0,
      "comments" => "No comments",
      "finalAmount" => 100.0,
      "bookStatus" => "booked",
      "payStatus" => "paid",
      "transactionId" => "Stripe",
      "createdAt" => date("Y-m-d H:i:s"),
      "bookingId" => "BOOK-" . random_string(8),
      "updatedAt" => date("Y-m-d H:i:s"),
    ];

    $info["service"] = str_replace("_", " ", $info["service"]);
    unset($info["coupon_discount"], $info["coupon_code"]);

    $o = $this->Commonmodel->save_data("booking", $info);

    try {
      extract($info);
      $hotelName = $this->Commonmodel->get_table_field(
        "hotels",
        "id = '" . $info["hotelId"] . "'",
        "name"
      );
      $to = FROM_PAYPAL_EMAIL;
      $t =
        $type == "private_transport"
          ? "Private Transportation"
          : "Cabo Shuttle";
      $subject =
        "A user has made a booking with " . SITE_NAME . " for " . $t . ".";
      $msgBody = "<html><body>";
      $msgBody .=
        '<img src="' .
        site_url("assets/img/newlogo.jpg") .
        '" alt="Insideloscabos" />';
      $userMsgBody = $msgBody;
      $msgBody .=
        "<div><strong>Dear Admin,</strong><br/>A user - " .
        $info["name"] .
        " has made a booking for hotel - " .
        $hotelName .
        " for " .
        $t .
        " with us. Please check the following booking details</div>";
      $userMsgBody .=
        "<div><strong>Dear " .
        $info["name"] .
        ",</strong><br/>Your booking has been done successfully for hotel - " .
        $hotelName .
        " for " .
        $t .
        " with " .
        SITE_NAME .
        ". Please check the following booking details</div>";
      $tableBody =
        '<p>You have successfully booked for Private Transportation- Our confirmation system will send you an email from: <a href="mailto:no_reply@insideloscabos.com">no_reply@insideloscabos.com</a> with your confirmation transportation voucher with all details and map, please be aware that some Antivirus send our email to the Spam!</p><br/></br>';
      $tableBody .=
        '<table rules="all" style="border-color: #666;" cellpadding="10">';
      $tableBody .= "<tr><td><strong>Paypal Transaction Id:</strong> </td><td>" .
        strip_tags($info["transactionId"]) .
        "</td></tr>";

      $tableBody .= "<tr><td><strong>Booking Date:</strong> </td><td>" .
        date("d/m/Y", strtotime($info["createdAt"])) .
        "</td></tr>";
      $tableBody .= "<tr style='background: #eee;'><td><strong>Name:</strong> </td><td>" .
        strip_tags($info["name"]) .
        "</td></tr>";
      $tableBody .= "<tr><td><strong>Email:</strong> </td><td>" .
        strip_tags($info["email"]) .
        "</td></tr>";
      $tableBody .= "<tr><td><strong>Phone:</strong> </td><td>" .
        strip_tags($info["phone"]) .
        "</td></tr>";
      $tableBody .= "<tr><td><strong>Passengers:</strong> </td><td>" .
        strip_tags($info["passengers"]) .
        "</td></tr>";
      $tableBody .= "<tr><td><strong>Hotel:</strong> </td><td>" .
        $hotelName .
        "</td></tr>";
      $tableBody .= "<tr><td><strong>Type Of Services:</strong> </td><td>" .
        $info["service"] .
        "</td></tr>";
      $tableBody .= "<tr><td><strong>Arrival Date:</strong> </td><td>" .
        strip_tags($info["arrivalDate"]) .
        "</td></tr>";
      $tableBody .= "<tr><td><strong>Arrival Flight Info: Airline, Flight Number and Time:</strong> </td><td>" .
        strip_tags($info["arrivalFlight"]) .
        "</td></tr>";
      if ($info["service"] == "round trip") {
        $tableBody .= "<tr><td><strong>Departure Date:</strong> </td><td>" .
          strip_tags($info["departureDate"]) .
          "</td></tr>";
        $tableBody .= "<tr><td><strong>Departure Flight Info: Airline, Flight Number and Time:</strong> </td><td>" .
          strip_tags($info["departureFlight"]) .
          "</td></tr>";
      }
      if ($type == "private_transport") {
        $tableBody .= "<tr><td><strong>Adults:</strong> </td><td>" .
          strip_tags($info["adults"]) .
          "</td></tr>";
        $tableBody .= "<tr><td><strong>Kids:</strong> </td><td>" .
          strip_tags($info["kids"]) .
          "</td></tr>";
      }
      $tableBody .= "<tr><td><strong>Comments:</strong> </td><td>" .
        htmlentities($info["comments"]) .
        "</td></tr>";
      if (!empty($info["couponCode"])) {
        $tableBody .= "<tr><td><strong>Coupon Code:</strong> </td><td>" .
          strip_tags($info["couponCode"]) .
          "</td></tr>";
        $tableBody .= "<tr><td><strong>Coupon Cost:</strong> </td><td>$" .
          strip_tags($info["couponAmount"]) .
          "</td></tr>";
      }
      if (!empty($info["discount"])) {
        $tableBody .= "<tr><td><strong>Discount:</strong> </td><td>" .
          strip_tags($info["discount"]) .
          " %</td></tr>";
        $tableBody .= "<tr><td><strong>Discount Cost:</strong> </td><td>$" .
          strip_tags($info["discountCost"]) .
          " </td></tr>";
      }
      $tableBody .= "<tr><td><strong>Booking Amount:</strong> </td><td>$ " .
        strip_tags($info["finalAmount"]) .
        "</td></tr>";
      $tableBody .= "<tr><td><strong>Booking Status:</strong> </td><td>" .
        strip_tags($info["bookStatus"]) .
        "</td></tr>";
      if (!empty($info["festiveCouponCode"])) {
        $tableBody .= "<tr><td><strong>Coupon Code:</strong> </td><td>" .
          strip_tags($info["festiveCouponCode"]) .
          "</td></tr>";
      }
      $tableBody .= "<tr style='background: #eee;'><td><strong>Booking Id:</strong> </td><td>" .
        strip_tags($info["bookingId"]) .
        "</td></tr>";
      $tableBody .= "</table><br>";
      $tableBody .= "<div>You will receive your confirmation transportation voucher from: no_reply@insideloscabos.com</div>";
      $tableBody .= "<br><div>Regards,<br><br>";
      $tableBody .= "<strong>" . SITE_NAME . "</strong><br><br>";
      $tableBody .= '<img src="' . site_url("assets/img/newlogo.jpg") . '" alt="Insideloscabos" />';
      $tableBody .= "</body></html></br>";
      $tableBody .= "<p>How to find us at Los Cabos Airport:</p></br>";
      $tableBody .= '<p>How to find us at Terminal 1: Go to the sign that says "Group Exits"</p></br></br>';
      $tableBody .= "<p>How to find us at Terminal 2 & 3:</p></br>";
      $tableBody .= '<p>As soon as you pass customs, go all the way "OUTSIDE" the building where all the transportation companies are. There you will find your Airport Rep with the sign, he is under the tent number 6.</p></br>';
      $msgBody .= $tableBody;
      $userMsgBody .= $tableBody;

      $headers = "MIME-Version: 1.0" . "\r\n";
      $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
      $headers .= "Content-Transfer-Encoding: 8bit" . "\r\n";

      $o = $this->Email_model->sendEmail(
        $to,
        $subject,
        $msgBody,
        [
          "http://reservations.impalacabo.com/assets/img/Terminal1.jpg",
          "http://reservations.impalacabo.com/assets/img/Terminal2.jpg",
        ],
        FROM_EMAIL,
        FROM_NAME,
        $headers
      );

      $userTo = $info["email"];
      $usersubject =
        SITE_NAME . " - Your booking has been made successfully with $t.";

      $o = $this->Email_model->sendEmail(
        $userTo,
        $usersubject,
        $userMsgBody,
        [
          "http://reservations.impalacabo.com/assets/img/Terminal1.jpg",
          "http://reservations.impalacabo.com/assets/img/Terminal2.jpg",
        ],
        FROM_EMAIL,
        FROM_NAME,
        $headers
      );
    } catch (Exception $ex) {
      echo "<pre>" . print_r($ex, true) . "</pre>";
      exit();
    }

    $this->Commonmodel->update_data("booking", $info, "id = '$id'");

    $bookId = base64_encode($info["bookingId"]);

    // redirect(
    //   "https://www.insideloscabos.com/transportation/BookingComplete?bookingId=" .
    //     $bookId
    // );
  }

  public function bookPrivate()
  {
    $data = [];
    $mstatus = "success";
    $message = "";
    $errormsg = "";
    $type = "private_transport";
    if ($_POST && count($_POST) > 0) {
      extract($this->input->post("info", true));
      $info = $this->input->post("info", true);
      $u =
        $type == "private_transport"
          ? "private-transportation"
          : "cabo-shuttle";
      $mo = $type == "private_transport" ? "private-transport" : "cabo-shuttle";
      if (!empty($hotelId)) {
        $c = $this->Commonmodel->get_count("hotels", "id = '" . $hotelId . "'");
        if ($c == 0) {
          redirect("/");
        }
      }
      $c = 0;
      $couponCost = 0;
      $coupon_code = @$_POST["info"]["coupon_code"];
      $coupon_discount = @$_POST["info"]["coupon_discount"];
      $rules["info[name]"] = ["name", "required|min_length[5]"];
      $rules["info[email]"] = ["email", "required|valid_email"];
      $rules["info[phone]"] = ["phone no", "required|numeric"];
      $rules["info[passengers]"] = ["passengers", "required"];
      $rules["info[hotelId]"] = ["hotel", "required"];
      $rules["info[service]"] = ["type of service", "required"];
      if ($info["type"] == "private_transport") {
        $rules["info[adults]"] = ["no of adults", "required|numeric"];
        $rules["info[kids]"] = ["no of kids", "required|numeric"];
      }

      $rules["info[arrivalDate]"] = ["arrival date", "required"];
      $rules["info[arrivalFlight]"] = ["arrival flight detail", "required"];
      if ($info["service"] == "round_trip") {
        $rules["info[departureDate]"] = ["departure date", "required"];
        $rules["info[departureFlight]"] = [
          "departure flight detail",
          "required",
        ];
      }

      $rules["info[comments]"] = ["comments", "required"];
      $this->Commonmodel->setFormsValidation($rules);

      if ($this->form_validation->run() == true) {
        $info = $this->input->post("info", true);
        if ($type == "private_transport") {
          $field =
            "cost_" . $service . "_" . str_replace("-", "_", $passengers);
        } else {
          $field = "cost_" . $service . "_1_5";
        }

        $cost = $this->Commonmodel->get_table_field(
          "hotelgroups",
          "find_in_set('$hotelId',hotels) != 0  and type = '$type'",
          $field
        );

        if ($type != "private_transport") {
          $cost = $cost * $passengers;
        }
        $cost = $cost ? $cost : 0;
        $info["calculateAmt"] = $cost;
        $info["couponCode"] = "";
        $cdate = date("Y-m-d");

        if (isset($arrivalDate) && !empty($arrivalDate)) {
          $arrivalDates = explode(" ", $arrivalDate);
          $adate = convertDate($arrivalDates[0], "d/m/Y", "Y-m-d");
          $atime = date(
            "H:i",
            strtotime($arrivalDates[1] . " " . $arrivalDates[2])
          );
          $info["arrivalDate"] = $arrivalDate = $adate . " " . $atime;

          if ($info["service"] == "round_trip") {
            $departureDates = explode(" ", $departureDate);
            $ddate = convertDate($departureDates[0], "d/m/Y", "Y-m-d");
            $dtime = date(
              "H:i",
              strtotime($departureDates[1] . " " . $departureDates[2])
            );
            $info["departureDate"] = $departureDate = $ddate . " " . $dtime;
          }
          $day = date("l", strtotime($adate));

          $dbArr = $this->Commonmodel->get_single_data(
            "discount",
            "day = '$day' and  '$atime' between fromTime and toTime and type = '$type'",
            "discount"
          );
          if (count($dbArr) > 0 && empty($coupon_code)) {
            $info["discount"] = $dis = $dbArr["discount"];
            $info["discountCost"] = round(($dis * $cost) / 100, 2);

            $cost = $cost - round(($dis * $cost) / 100, 2);
          }
        }

        $info["finalAmount"] = $cost;

        if ($cost != 0) {
          //$info['cost'] = $cost;

          $SECFields = [
            "maxamt" => $cost, // The expected maximum total amount the order will be, including S&H and sales tax.
            "returnurl" =>
              "https://www.insideloscabos.com/transportation/GetBookingDetails", // Required.  URL to which the customer will be returned after returning from PayPal.  2048 char max.
            "cancelurl" =>
              "https://www.insideloscabos.com/transportation/BookingCancelled", // Required.  URL to which the customer will be returned if they cancel payment on PayPal's site.
            "hdrimg" => base_url("assets/img/logo.png"), // URL for the image displayed as the header during checkout.  Max size of 750x90.  Should be stored on an https:// server or you'll get a warning message in the browser.
            "logoimg" => base_url("assets/img/logo.png"), // A URL to your logo image.  Formats:  .gif, .jpg, .png.  190x60.  PayPal places your logo image at the top of the cart review area.  This logo needs to be stored on a https:// server.
            "brandname" => SITE_NAME, // A label that overrides the business name in the PayPal account on the PayPal hosted checkout pages.  127 char max.
            "customerservicenumber" => MERCHANT_CUSTOMER_NO, // Merchant Customer Service number displayed on the PayPal Review page. 16 char max.
          ];

          /**
           * Now we begin setting up our payment(s).
           *
           * Express Checkout includes the ability to setup parallel payments,
           * so we have to populate our $Payments array here accordingly.
           *
           * For this sample (and in most use cases) we only need a single payment,
           * but we still have to populate $Payments with a single $Payment array.
           *
           * Once again, the template file includes a lot more available parameters,
           * but for this basic sample we've removed everything that we're not using,
           * so all we have is an amount.
           */
          $Payments = [];
          $Payment = [
            "amt" => $cost, // Required.  The total cost of the transaction to the customer.  If shipping cost and tax charges are known, include them in this value.  If not, this value should be the current sub-total of the order.
          ];

          /**
           * Here we push our single $Payment into our $Payments array.
           */
          array_push($Payments, $Payment);

          /**
           * Now we gather all of the arrays above into a single array.
           */
          $PayPalRequestData = [
            "SECFields" => $SECFields,
            "Payments" => $Payments,
          ];

          /**
           * Here we are making the call to the SetExpressCheckout function in the library,
           * and we're passing in our $PayPalRequestData that we just set above.
           */
          $PayPalResult = $this->paypal_pro->SetExpressCheckout(
            $PayPalRequestData
          );

          /**
           * Now we'll check for any errors returned by PayPal, and if we get an error,
           * we'll save the error details to a session and redirect the user to an
           * error page to display it accordingly.
           *
           * If all goes well, we save our token in a session variable so that it's
           * readily available for us later, and then redirect the user to PayPal
           * using the REDIRECTURL returned by the SetExpressCheckout() function.
           */
          if (!$this->paypal_pro->APICallSuccessful($PayPalResult["ACK"])) {
            $errors = ["Errors" => $PayPalResult["ERRORS"]];
            $data["mo"] = "paypal_result";
            $data["paypalTitle"] = "PayPal Error";
            // $data['startOver'] = site_url($u);
            $data["startOver"] = "https://www.insideloscabos.com/" . $u;
            $data["paypalCase"] = "error";
            $data["paypalErrors"] = $errors;
            $data["paypalMsg"] =
              "Some error occurred during processing with paypal";
            // Load errors to variable
            $data["errors"] = $errors;
            $mstatus = "error";
            echo "ERROR - <pre>" . print_r($errors, true) . "</pre>";

            $this->load->view("index", $data);
          } else {
            // Successful call.
            // Set PayPalResult into session userdata (so we can grab data from it later on a 'payment complete' page)
            $info["createdAt"] = date("Y-m-d H:i:s");
            $info["bookingId"] = "BOOK-" . random_string(8);
            $info["service"] = str_replace("_", " ", $info["service"]);
            unset($info["coupon_discount"], $info["coupon_code"]);
            // echo "<pre>";
            // print_r($info);die;
            $o = $this->Commonmodel->save_data("booking", $info);
            if ($o) {
              $info["id"] = $o;
              $info["type"] = $type;
              $this->session->set_userdata("bookData", $info);

              $PayPalResult["NewRedirectUrl"] = str_replace(
                "continue",
                "commit",
                $PayPalResult["REDIRECTURL"]
              );
              $this->session->set_userdata("PayPalResult", $PayPalResult);

              // In most cases you would automatically redirect to the returned 'RedirectURL' by using: redirect($PayPalResult['REDIRECTURL'],'Location');
              // Move to PayPal checkout
              $redu = str_replace(
                "continue",
                "commit",
                $PayPalResult["REDIRECTURL"]
              );

              redirect($redu, "Location");
            } else {
              $mstatus = "error";
              $message = "Unable to proccess your request.Please try again";
            }
          }
        }
      } else {
        $message = "Some parameters are missing or not valid";
        $mstatus = "error";
      }
    } else {
      $message = "Params are invalid.Please try again";
      $mstatus = "error";

      redirect("/" . $u);
    }
    $data["msg"] = $message;
    $data["mstatus"] = $mstatus;
    $data["info"] = [];
    if ($mstatus == "error") {
      $data["info"] = $_POST["info"];
    }
    $data["mo"] = $mo;
    $data["dbHotels"] = $this->Commonmodel->get_data(
      "hotels",
      "status = '1'",
      "*"
    );

    $this->load->view("index", $data);
  }

  /**
   * GetBookingDetails
   */
  function GetBookingDetails()
  {
    $data = [];
    // Get cart data from session userdata
    $bookData = $this->session->userdata("bookData");

    $u =
      $bookData["type"] == "private_transport"
        ? "private-transportation"
        : "cabo-shuttle";
    // Get PayPal data from session userdata
    $SetExpressCheckoutPayPalResult = $this->session->userdata("PayPalResult");

    $PayPal_Token = $SetExpressCheckoutPayPalResult["TOKEN"];

    /**
     * Now we pass the PayPal token that we saved to a session variable
     * in the SetExpressCheckout.php file into the GetBookingDetails
     * request.
     */
    $PayPalResult = $this->paypal_pro->GetExpressCheckoutDetails($PayPal_Token);
    //        echo "<pre>".print_r($PayPalResult, true)."</pre>";

    /**
     * Now we'll check for any errors returned by PayPal, and if we get an error,
     * we'll save the error details to a session and redirect the user to an
     * error page to display it accordingly.
     *
     * If the call is successful, we'll save some data we might want to use
     * later into session variables.
     */
    if (!$this->paypal_pro->APICallSuccessful($PayPalResult["ACK"])) {
      $errors = ["Errors" => $PayPalResult["ERRORS"]];
      $data["mo"] = "paypal_result";
      $data["paypalTitle"] = "PayPal Error";
      // $data['startOver'] = site_url($u);
      $data["startOver"] = "https://www.insideloscabos.com/" . $u;
      $data["paypalCase"] = "error";
      $data["paypalErrors"] = $errors;
      // Load errors to variable
      $this->load->vars("errors", $errors);

      $this->load->view("index", $data);
    } else {
      // Successful call.

      /**
       * Here we'll pull out data from the PayPal response.
       * Refer to the PayPal API Reference for all of the variables available
       * in $PayPalResult['variablename']
       *
       * https://developer.paypal.com/docs/classic/api/merchant/GetBookingDetails_API_Operation_NVP/
       *
       * Again, Express Checkout allows for parallel payments, so what we're doing here
       * is usually the library to parse out the individual payments using the GetPayments()
       * method so that we can easily access the data.
       *
       * We only have a single payment here, which will be the case with most checkouts,
       * but we will still loop through the $Payments array returned by the library
       * to grab our data accordingly.
       */
      $paypalData["paypal_payer_id"] = isset($PayPalResult["PAYERID"])
        ? $PayPalResult["PAYERID"]
        : "";
      $paypalData["phone_number"] = isset($PayPalResult["PHONENUM"])
        ? $PayPalResult["PHONENUM"]
        : "";
      $paypalData["email"] = isset($PayPalResult["EMAIL"])
        ? $PayPalResult["EMAIL"]
        : "";
      $paypalData["first_name"] = isset($PayPalResult["FIRSTNAME"])
        ? $PayPalResult["FIRSTNAME"]
        : "";
      $paypalData["last_name"] = isset($PayPalResult["LASTNAME"])
        ? $PayPalResult["LASTNAME"]
        : "";

      foreach ($PayPalResult["PAYMENTS"] as $payment) {
        $paypalData["shipping_name"] = isset($payment["SHIPTONAME"])
          ? $payment["SHIPTONAME"]
          : "";
        $paypalData["shipping_street"] = isset($payment["SHIPTOSTREET"])
          ? $payment["SHIPTOSTREET"]
          : "";
        $paypalData["shipping_city"] = isset($payment["SHIPTOCITY"])
          ? $payment["SHIPTOCITY"]
          : "";
        $paypalData["shipping_state"] = isset($payment["SHIPTOSTATE"])
          ? $payment["SHIPTOSTATE"]
          : "";
        $paypalData["shipping_zip"] = isset($payment["SHIPTOZIP"])
          ? $payment["SHIPTOZIP"]
          : "";
        $paypalData["shipping_country_code"] = isset(
          $payment["SHIPTOCOUNTRYCODE"]
        )
          ? $payment["SHIPTOCOUNTRYCODE"]
          : "";
        $paypalData["shipping_country_name"] = isset(
          $payment["SHIPTOCOUNTRYNAME"]
        )
          ? $payment["SHIPTOCOUNTRYNAME"]
          : "";
      }

      /**
       * At this point, we now have the buyer's shipping address available in our app.
       * We could now run the data through a shipping calculator to retrieve rate
       * information for this particular order.
       *
       * This would also be the time to calculate any sales tax you may need to
       * add to the order, as well as handling fees.
       *
       * We're going to set static values for these things in our static
       * shopping cart, and then re-calculate our grand total.
       */
      $this->session->set_userdata("payPalData", $PayPalResult);
      // Example - Load Review Page
      //            $this->load->view('paypal/demos/express_checkout/review', $paypalData);
      $this->DoExpressCheckoutPayment();
    }
  }

  /**
   * DoExpressCheckoutPayment
   */
  function DoExpressCheckoutPayment()
  {
    $data = [];
    $info = $this->session->userdata("bookData");
    if (empty($info) && !is_array($info)) {
      redirect(site_url("/"));
    }
    extract($info);
    $u =
      $info["type"] == "private_transport"
        ? "private-transportation"
        : "cabo-shuttle";

    /**
     * Now we'll setup the request params for the final call in the Express Checkout flow.
     * This is very similar to SetExpressCheckout except that now we can include values
     * for the shipping, handling, and tax amounts, as well as the buyer's name and
     * shipping address that we obtained in the GetBookingDetails step.
     *
     * If this information is not included in this final call, it will not be
     * available in PayPal's transaction details data.
     *
     * Once again, the template for DoExpressCheckoutPayment provides
     * many more params that are available, but we've stripped everything
     * we are not using in this basic demo out.
     */
    // Get cart data from session userdata
    $paypalData = $this->session->userdata("payPalData");
    // Get cart data from session userdata
    $SetExpressCheckoutPayPalResult = $this->session->userdata("PayPalResult");
    $PayPal_Token = $SetExpressCheckoutPayPalResult["TOKEN"];

    $DECPFields = [
      "token" => $PayPal_Token, // Required.  A timestamped token, the value of which was returned by a previous SetExpressCheckout call.
      "payerid" => $paypalData["PAYERID"], // Required.  Unique PayPal customer id of the payer.  Returned by GetBookingDetails, or if you used SKIPDETAILS it's returned in the URL back to your RETURNURL.
    ];

    /**
     * Just like with SetExpressCheckout, we need to gather our $Payment
     * data to pass into our $Payments array.  This time we can include
     * the shipping, handling, tax, and shipping address details that we
     * now have.
     */
    $Payments = [];
    //        $Payment = array(
    //            'amt' => number_format($paypalData['shopping_cart']['grand_total'], 2), // Required.  The total cost of the transaction to the customer.  If shipping cost and tax charges are known, include them in this value.  If not, this value should be the current sub-total of the order.
    //            'itemamt' => number_format($paypalData['shopping_cart']['subtotal'], 2), // Subtotal of items only.
    //            'currencycode' => 'USD', // A three-character currency code.  Default is USD.
    //            'shippingamt' => number_format($paypalData['shopping_cart']['shipping'], 2), // Total shipping costs for this order.  If you specify SHIPPINGAMT you mut also specify a value for ITEMAMT.
    //            'handlingamt' => number_format($paypalData['shopping_cart']['handling'], 2), // Total handling costs for this order.  If you specify HANDLINGAMT you mut also specify a value for ITEMAMT.
    //            'taxamt' => number_format($paypalData['shopping_cart']['tax'], 2), // Required if you specify itemized L_TAXAMT fields.  Sum of all tax items in this order.
    //            'shiptoname' => $paypalData['shipping_name'], // Required if shipping is included.  Person's name associated with this address.  32 char max.
    //            'shiptostreet' => $paypalData['shipping_street'], // Required if shipping is included.  First street address.  100 char max.
    //            'shiptocity' => $paypalData['shipping_city'], // Required if shipping is included.  Name of city.  40 char max.
    //            'shiptostate' => $paypalData['shipping_state'], // Required if shipping is included.  Name of state or province.  40 char max.
    //            'shiptozip' => $paypalData['shipping_zip'], // Required if shipping is included.  Postal code of shipping address.  20 char max.
    //            'shiptocountrycode' => $paypalData['shipping_country_code'], // Required if shipping is included.  Country code of shipping address.  2 char max.
    //            'shiptophonenum' => $paypalData['phone_number'], // Phone number for shipping address.  20 char max.
    //            'paymentaction' => 'Sale', // How you want to obtain the payment.  When implementing parallel payments, this field is required and must be set to Order.
    //        );
    $Payment = [
      "amt" => number_format($paypalData["PAYMENTREQUEST_0_AMT"], 2), // Required.  The total cost of the transaction to the customer.  If shipping cost and tax charges are known, include them in this value.  If not, this value should be the current sub-total of the order.
      "itemamt" => number_format($paypalData["PAYMENTREQUEST_0_ITEMAMT"], 2), // Subtotal of items only.
      "currencycode" => "USD", // A three-character currency code.  Default is USD.
      "shippingamt" => number_format(
        $paypalData["PAYMENTREQUEST_0_SHIPPINGAMT"],
        2
      ), // Total shipping costs for this order.  If you specify SHIPPINGAMT you mut also specify a value for ITEMAMT.
      "handlingamt" => number_format(
        $paypalData["PAYMENTREQUEST_0_HANDLINGAMT"],
        2
      ), // Total handling costs for this order.  If you specify HANDLINGAMT you mut also specify a value for ITEMAMT.
      "taxamt" => number_format($paypalData["PAYMENTREQUEST_0_TAXAMT"], 2), // Required if you specify itemized L_TAXAMT fields.  Sum of all tax items in this order.
      "shiptoname" => $paypalData["PAYMENTREQUEST_0_SHIPTONAME"], // Required if shipping is included.  Person's name associated with this address.  32 char max.
      "shiptostreet" => $paypalData["PAYMENTREQUEST_0_SHIPTOSTREET"], // Required if shipping is included.  First street address.  100 char max.
      "shiptocity" => $paypalData["PAYMENTREQUEST_0_SHIPTOCITY"], // Required if shipping is included.  Name of city.  40 char max.
      "shiptostate" => $paypalData["PAYMENTREQUEST_0_SHIPTOSTATE"], // Required if shipping is included.  Name of state or province.  40 char max.
      "shiptozip" => $paypalData["PAYMENTREQUEST_0_SHIPTOZIP"], // Required if shipping is included.  Postal code of shipping address.  20 char max.
      "shiptocountrycode" => $paypalData["PAYMENTREQUEST_0_SHIPTOCOUNTRYCODE"], // Required if shipping is included.  Country code of shipping address.  2 char max.
      "shiptophonenum" => "", // Phone number for shipping address.  20 char max.
      "paymentaction" => "Sale", // How you want to obtain the payment.  When implementing parallel payments, this field is required and must be set to Order.
    ];

    /**
     * Here we push our single $Payment into our $Payments array.
     */
    array_push($Payments, $Payment);

    /**
     * Now we gather all of the arrays above into a single array.
     */
    $PayPalRequestData = [
      "DECPFields" => $DECPFields,
      "Payments" => $Payments,
    ];

    /**
     * Here we are making the call to the DoExpressCheckoutPayment function in the library,
     * and we're passing in our $PayPalRequestData that we just set above.
     */
    $PayPalResult = $this->paypal_pro->DoExpressCheckoutPayment(
      $PayPalRequestData
    );

    /**
     * Now we'll check for any errors returned by PayPal, and if we get an error,
     * we'll save the error details to a session and redirect the user to an
     * error page to display it accordingly.
     *
     * If the call is successful, we'll save some data we might want to use
     * later into session variables, and then redirect to our final
     * thank you / receipt page.
     */
    if (!$this->paypal_pro->APICallSuccessful($PayPalResult["ACK"])) {
      $errors = ["Errors" => $PayPalResult["ERRORS"]];
      $data["mo"] = "paypal_result";
      $data["paypalTitle"] = "PayPal Error";
      // $data['startOver'] = site_url($u);
      $data["startOver"] = "https://www.insideloscabos.com/" . $u;
      $data["paypalCase"] = "error";
      $data["paypalErrors"] = $errors;
      // Load errors to variable
      $this->load->vars("errors", $errors);

      $this->load->view("index", $data);
    } else {
      // Successful call.
      /**
       * Once again, since Express Checkout allows for multiple payments in a single transaction,
       * the DoExpressCheckoutPayment response is setup to provide data for each potential payment.
       * As such, we need to loop through all the payment info in the response.
       *
       * The library helps us do this using the GetExpressCheckoutPaymentInfo() method.  We'll
       * load our $payments_info using that method, and then loop through the results to pull
       * out our details for the transaction.
       *
       * Again, in this case we are you only working with a single payment, but we'll still
       * loop through the results accordingly.
       *
       * Here, we're only pulling out the PayPal transaction ID and fee amount, but you may
       * refer to the API reference for all the additional parameters you have available at
       * this point.
       *
       * https://developer.paypal.com/docs/classic/api/merchant/DoExpressCheckoutPayment_API_Operation_NVP/
       */
      foreach ($PayPalResult["PAYMENTS"] as $payment) {
        $paypalData["paypal_transaction_id"] = isset($payment["TRANSACTIONID"])
          ? $payment["TRANSACTIONID"]
          : "";
        $paypalData["paypal_fee"] = isset($payment["FEEAMT"])
          ? $payment["FEEAMT"]
          : "";
      }

      // Set example cart data into session

      $info["jsonData"] = json_encode($paypalData);
      $info["bookStatus"] = "booked";
      $info["paypalTime"] = $paypalData["TIMESTAMP"];
      $info["ack"] = $paypalData["ACK"];
      $info["payerEmail"] = $paypalData["EMAIL"];
      $info["payerId"] = $paypalData["PAYERID"];
      $info["payerStatus"] = $paypalData["PAYERSTATUS"];
      $info["payerName"] =
        $paypalData["FIRSTNAME"] . " " . $paypalData["LASTNAME"];
      $info["payerCountrycode"] = $paypalData["COUNTRYCODE"];
      $info["shipToName"] = $paypalData["SHIPTONAME"];
      $info["currency"] = $paypalData["CURRENCYCODE"];
      $info["paypalAmt"] = $paypalData["AMT"];
      //$info['paypalTaxAmt']=$paypalData['TAXAMT'];
      $info["sellerEmail"] =
        $paypalData["PAYMENTREQUEST_0_SELLERPAYPALACCOUNTID"];
      $info["transactionId"] = $paypalData["paypal_transaction_id"];
      $info["paypalFee"] = $paypalData["paypal_fee"];
      try {
        extract($info);
        $info["payStatus"] = "paid";
        $info["updatedAt"] = date("Y-m-d H:i:s");
        $this->Commonmodel->update_data("booking", $info, "id = '$id'");
        $hotelName = $this->Commonmodel->get_table_field(
          "hotels",
          "id = '" . $info["hotelId"] . "'",
          "name"
        );
        $to = FROM_PAYPAL_EMAIL;
        $t =
          $type == "private_transport"
            ? "Private Transportation"
            : "Cabo Shuttle";
        $subject =
          "A user has made a booking with " . SITE_NAME . " for " . $t . ".";
        $msgBody = "<html><body>";
        $msgBody .=
          '<img src="' .
          site_url("assets/img/newlogo.jpg") .
          '" alt="Insideloscabos" />';
        $userMsgBody = $msgBody;
        $msgBody .=
          "<div><strong>Dear Admin,</strong><br/>A user - " .
          $info["name"] .
          " has made a booking for hotel - " .
          $hotelName .
          " for " .
          $t .
          " with us.Please check the following booking details</div>";
        $userMsgBody .=
          "<div><strong>Dear $name,</strong><br/>Your booking has been done successfully for hotel - " .
          $hotelName .
          " for " .
          $t .
          " with " .
          SITE_NAME .
          ".Please check the following booking details</div>";
        $tableBody =
          '<p>You have successfully booked for Private Transaportation- Our confirmation system will send you an email from: <a href="mailto:no_reply@insideloscabos.com">no_reply@insideloscabos.com</a> with your confirmation transportation voucher with all details and map, please be aware that some Antivirus send our email to the Spam!</p><br/></br>';
        $tableBody .=
          '<table rules="all" style="border-color: #666;" cellpadding="10">';
        $tableBody .= "<tr><td><strong>Paypal Transaction Id:</strong> </td><td>" .
          strip_tags($info["transactionId"]) .
          "</td></tr>";

        $tableBody .= "<tr><td><strong>Booking Date:</strong> </td><td>" .
          date("d/m/Y", strtotime($info["createdAt"])) .
          "</td></tr>";
        $tableBody .= "<tr style='background: #eee;'><td><strong>Name:</strong> </td><td>" .
          strip_tags($info["name"]) .
          "</td></tr>";
        $tableBody .= "<tr><td><strong>Email:</strong> </td><td>" .
          strip_tags($info["email"]) .
          "</td></tr>";
        $tableBody .= "<tr><td><strong>Phone:</strong> </td><td>" .
          strip_tags($info["phone"]) .
          "</td></tr>";
          $hotelName .
          " for " .
          $t .
          " with " .
          SITE_NAME .
          ".Please check the following booking details</div>";
        $tableBody =
          '<p>You have successfully booked for Private Transaportation- Our confirmation system will send you an email from: <a href="mailto:no_reply@insideloscabos.com">no_reply@insideloscabos.com</a> with your confirmation transportation voucher with all details and map, please be aware that some Antivirus send our email to the Spam!</p><br/></br>';
        $tableBody .=
          '<table rules="all" style="border-color: #666;" cellpadding="10">';
        $tableBody .=
          "<tr><td><strong>Paypal Transaction Id:</strong> </td><td>" .
          "" .
          " " .
          strip_tags($info["transactionId"]) .
          "</td></tr>";

        $tableBody .=
          "<tr><td><strong>Booking Date:</strong> </td><td>" .
          date("d/m/Y", strtotime($info["createdAt"])) .
          "</td></tr>";
        $tableBody .=
          "<tr style='background: #eee;'><td><strong>Name:</strong> </td><td>" .
          strip_tags($info["name"]) .
          "</td></tr>";
        $tableBody .=
          "<tr><td><strong>Email:</strong> </td><td>" .
          strip_tags($info["email"]) .
          "</td></tr>";
        $tableBody .=
          "<tr><td><strong>Phone:</strong> </td><td>" .
          strip_tags($info["phone"]) .
          "</td></tr>";
        $tableBody .=
          "<tr><td><strong>Passengers:</strong> </td><td>" .
          strip_tags($info["passengers"]) .
          "</td></tr>";
        $tableBody .=
          "<tr><td><strong>Hotel:</strong> </td><td>" .
          $hotelName .
          "</td></tr>";
        $tableBody .=
          "<tr><td><strong>Type Of Services:</strong> </td><td>" .
          $info["service"] .
          "</td></tr>";
        $tableBody .=
          "<tr><td><strong>Arrival Date:</strong> </td><td>" .
          strip_tags($arrivalDate) .
          "</td></tr>";
        $tableBody .=
          "<tr><td><strong>Arrival Flight Info: Airline, Flight Number and Time):</strong> </td><td>" .
          strip_tags($info["arrivalFlight"]) .
          "</td></tr>";
        if ($service == "round trip") {
          $tableBody .=
            "<tr><td><strong>Departure Date:</strong> </td><td>" .
            strip_tags($departureDate) .
            "</td></tr>";
          $tableBody .=
            "<tr><td><strong>Departure Flight Info: Airline, Flight Number and Time:</strong> </td><td>" .
            strip_tags($info["departureFlight"]) .
            "</td></tr>";
        }
        if ($type == "private_transport") {
          $tableBody .=
            "<tr><td><strong>Adults:</strong> </td><td>" .
            strip_tags($adults) .
            "</td></tr>";
          $tableBody .=
            "<tr><td><strong>Kids:</strong> </td><td>" .
            strip_tags($kids) .
            "</td></tr>";
        }

        $tableBody .=
          "<tr><td><strong>Comments:</strong> </td><td>" .
          htmlentities($info["comments"]) .
          "</td></tr>";
        if (!empty($info["couponCode"])) {
          $tableBody .=
            "<tr><td><strong>Coupon Code:</strong> </td><td>" .
            strip_tags($info["couponCode"]) .
            "</td></tr>";
          $tableBody .=
            "<tr><td><strong>Coupon Cost:</strong> </td><td>$" .
            strip_tags($info["couponAmount"]) .
            "</td></tr>";
        }
        if (!empty($info["discount"])) {
          $tableBody .=
            "<tr><td><strong>Discount:</strong> </td><td>" .
            strip_tags($info["discount"]) .
            " %</td></tr>";
          $tableBody .=
            "<tr><td><strong>Discount Cost:</strong> </td><td>$" .
            strip_tags($info["discountCost"]) .
            " </td></tr>";
        }

        $tableBody .=
          "<tr><td><strong>Booking Amount:</strong> </td><td>$ " .
          strip_tags($info["finalAmount"]) .
          "</td></tr>";
        $tableBody .=
          "<tr><td><strong>Booking Status:</strong> </td><td>" .
          strip_tags($info["bookStatus"]) .
          "</td></tr>";
        if (!empty(@$info["festiveCouponCode"])) {
          $tableBody .=
            "<tr><td><strong>Coupon Code:</strong> </td><td>" .
            strip_tags(@$info["festiveCouponCode"]) .
            "</td></tr>";
        }
        $tableBody .=
          "<tr style='background: #eee;'><td><strong>Booking Id:</strong> </td><td>" .
          strip_tags($info["bookingId"]) .
          "</td></tr>";
        $tableBody .= "</table><br>";
        $tableBody .=
          "<div>You will receive your confirmation transportation voucher from: no_reply@insideloscabos.com</div>";
        $tableBody .= "<br><div>Regards,<br><br>";
        $tableBody .= "<strong>" . SITE_NAME . "</strong><br><br>";
        $tableBody .=
          '<img src="' .
          site_url("assets/img/newlogo.jpg") .
          '" alt="Insideloscabos" />';

        $tableBody .= "</body></html></br>";
        $tableBody .= "<p>How to find us at Los Cabos Airport:</p></br>";
        $tableBody .=
          '<p>How to find us at Terminal 1: Go to the sign that says "Group Exits"</p></br></br>';
        $tableBody .= "<p>How to find us at Terminal 2 & 3:</p></br>";
        $tableBody .=
          '<p>As soon as you pass customs, go all the way "OUTSIDE" the building  where all the transportation companies are. There you will find your Airport Rep with the sign, he is under the tent number 6.</p></br>';
        $msgBody .= $tableBody;
        $userMsgBody .= $tableBody;

        $o = $this->Email_model->sendEmail(
          $to,
          $subject,
          $msgBody,
          [
            "http://reservations.impalacabo.com/assets/img/Terminal1.jpg",
            "http://reservations.impalacabo.com/assets/img/Terminal2.jpg",
          ],
          FROM_EMAIL,
          FROM_NAME
        );

        $userTo = $info["email"];
        $usersubject =
          SITE_NAME . " - Your booking has been made successfully with $t.";

        $o = $this->Email_model->sendEmail(
          $userTo,
          $usersubject,
          $userMsgBody,
          [
            "http://reservations.impalacabo.com/assets/img/Terminal1.jpg",
            "http://reservations.impalacabo.com/assets/img/Terminal2.jpg",
          ],
          FROM_EMAIL,
          FROM_NAME
        );
      } catch (Exception $ex) {
        echo "<pre>" . print_r($ex, true) . "</pre>";
        exit();
      }
      // Successful Order
      $bookId = base64_encode($info["bookingId"]);
      $this->session->unset_userdata("bookData");
      $this->session->unset_userdata("PayPal");

      redirect(
        "https://www.insideloscabos.com/transportation/BookingComplete?bookingId=" .
          $bookId
      );
    }
  }

  /**
   * Order Complete - Pay Return Url
   */
  function BookingComplete()
  {
    // Get cart from session userdata

    extract($this->input->get());

    if (empty($bookingId) && !isset($bookingId)) {
      redirect("/");
    }
    $bookingId = base64_decode($bookingId);
    $dbBook = $this->Commonmodel->get_single_data(
      "booking",
      "bookingId = '$bookingId' and bookStatus = 'booked'",
      "*,(select name from hotels where hotels.id = booking.hotelId) as hotelName"
    );
    $u =
      $dbBook["type"] == "private_transport"
        ? "private-transportation"
        : "cabo-shuttle";

    if (count($dbBook) > 0) {
      $data = $dbBook;
      $data["mo"] = "paypal_result";
      $data["paypalTitle"] = "Payment Success";
      // $data['startOver'] = site_url($u);
      $data["startOver"] = "https://www.insideloscabos.com/" . $u;
      $data["returnText"] =
        $u == "private-transportation"
          ? "Private Transportation"
          : "Cabo Shuttle";
      $data["paypalCase"] = "booked";
      $data["paypalMsg"] =
        "We have now reached the final thank you / receipt page and the payment has been processed!  We have added the PayPal transaction ID to the Billing Information, which was provided in the DoExpressCheckoutPayment response.";

      $this->load->view("index", $data);
    } else {
      redirect("/");
    }
    //        $this->load->view('paypal/demos/express_checkout/payment_complete');
  }

  /**
   * Order Cancelled - Pay Cancel Url
   */
  function BookingCancelled()
  {
    $bookData = $this->session->userdata("bookData");
    $u =
      $bookData["type"] == "private_transport"
        ? "private-transportation"
        : "cabo-shuttle";

    $bookid = $bookData["id"];
    $this->Commonmodel->update_data("booking", "id = '$bookid'", [
      "bookStatus" => "canceled",
    ]);
    $this->session->unset_userdata("PayPalResult");
    $this->session->unset_userdata("bookData");
    $data["mo"] = "paypal_result";
    $data["paypalTitle"] = "PayPal - Payment Cancelled";
    $data["startOver"] = "https://www.insideloscabos.com/" . $u;
    $data["returnText"] =
      $u == "private-transportation"
        ? "Private Transportation"
        : "Cabo Shuttle";
    $data["paypalCase"] = "cancelled";
    $data["paypalMsg"] =
      "The payment has not been processed at this point because you cancelled the payment.";

    // Successful call.  Load view or whatever you need to do here.
    //        $this->load->view('paypal/demos/express_checkout/order_cancelled');
    $this->load->view("index", $data);
  }
}
