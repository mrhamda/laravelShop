<?php

namespace App\Http\Controllers;

use App\Models\collectMoneyModel;
use Illuminate\Http\Client\Request as ClientRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class PayPalController extends Controller
{
    /**
     * @noinspection PhpMissingReturnTypeInspection
     */
    public function index()
    {
        return Inertia::render('posts/view',  [
            'paypalClientId' => config('paypal.client_id'),
            'user' => Auth::user(),
            'csrfToken' => csrf_token(),
        ]);
    }

    /**
     * @return string
     */
    private function getAccessToken(): string
    {
        $headers = [
            'Content-Type'  => 'application/x-www-form-urlencoded',
            'Authorization' => 'Basic ' . base64_encode(config('paypal.client_id') . ':' . config('paypal.client_secret'))
        ];

        $response = Http::withHeaders($headers)
            ->withBody('grant_type=client_credentials')
            ->post(config('paypal.base_url') . '/v1/oauth2/token');

        return json_decode($response->body())->access_token;
    }

    /**
     * @return string
     */
    public function create(int $amount = 10): string
    {

        $id = uuid_create();

        $headers = [
            'Content-Type'      => 'application/json',
            'Authorization'     => 'Bearer ' . $this->getAccessToken(),
            'PayPal-Request-Id' => $id,
        ];

        $body = [
            "intent"         => "CAPTURE",
            "purchase_units" => [
                [
                    "reference_id" => $id,
                    "amount"       => [
                        "currency_code" => "SEK",
                        "value"         => number_format($amount, 2, '.', '')

                    ]
                ]
            ]
        ];

        $response = Http::withHeaders($headers)
            ->withBody(json_encode($body))
            ->post(config('paypal.base_url') . '/v2/checkout/orders');

        Session::put('request_id', $id);
        Session::put('order_id', json_decode($response->body())->id);

        return json_decode($response->body())->id;
    }

    /**
     * @return mixed
     */
    public function complete()
    {
        $url = config('paypal.base_url') . '/v2/checkout/orders/' . Session::get('order_id') . '/capture';

        $headers = [
            'Content-Type'  => 'application/json',
            'Authorization' => 'Bearer ' . $this->getAccessToken(),
        ];

        $response = Http::withHeaders($headers)
            ->post($url, null);

        return json_decode($response->body());
    }


    function createOrder(Request $req)
    {
        $user = Auth::user();

        $accessToken = $this->getAccessToken();

        $moneyObject = collectMoneyModel::findOrFail($user['id']);

        $amount = $moneyObject['money'];

        $email = $req->input('email');


        $response = Http::withToken($accessToken)->post('https://api-m.sandbox.paypal.com/v1/payments/payouts', [
            "sender_batch_header" => [
                "sender_batch_id" => uniqid(),
                "email_subject" => "You've received a payout!",
            ],
            "items" => [
                [
                    "recipient_type" => "EMAIL",
                    "amount" => [
                        "value" => number_format($amount, 2, '.', ''),
                        "currency" => "SEK"
                    ],
                    "receiver" => $email,
                    "note" => "Payout from marketplace",
                    "sender_item_id" => "item_" . uniqid(),
                ]
            ]
        ]);


        if ($response->successful()) {
            $moneyObject->update(
                ['money' => 0]
            );

            return response()->json(['success' => true, 'payout' => $response->json()]);
        } else {
            return response()->json(['error' => 'Payout failed', 'details' => $response->json()], 500);
        }
    }
}
