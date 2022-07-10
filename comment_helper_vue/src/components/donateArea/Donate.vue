<template>
  <div class="donate text-left">
    <div class="title pb-3 mb-3 font-bold text-2xl">贊助或請小助手喝杯咖啡？</div>
    <p class="text-sm">如果小助手幫妳省下很多時間，能否贊助點經費買杯咖啡請我喝喝？有您的捐款小助手將永遠保持免費給粉絲團經營使用。</p>
    <br />

    <div class="ecpay">
      <a href="https://core.spgateway.com/EPG/comment_helper/AT7UpC" target="_blank">
        <img src="https://www.newebpay.com/ud/img/logo_sm2.png" />
      </a>
    </div>
    <p class="text-base mt-4 text-blue-500">非臺灣用戶請使用下方 Paypal 付款</p>
    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
      <input type="hidden" name="cmd" value="_s-xclick">
      <table>
        <tr>
          <td style="color:#666;">
            <input type="hidden" name="on0" value="Buy Me A Coffee">Buy Me A Coffee</td>
        </tr>
        <tr>
          <td>
            <select style="width: 300px; display: inline-block; border: 1px solid #000" name="os0">
              <option value="Starbucks">Starbucks NT$100 TWD</option>
              <option value="Starbucks+Sweets">Starbucks+Sweets NT$200 TWD</option>
              <option value="Dinner">Dinner NT$300 TWD</option>
            </select>
          </td>
        </tr>
      </table>
      <br>
      <input type="hidden" name="currency_code" value="TWD">
      <input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----
    ">
      <input type="image" src="https://www.paypalobjects.com/en_GB/i/btn/btn_paynow_SM.gif" border="0" name="submit"
        alt="PayPal – The safer, easier way to pay online.">
      <img alt="" border="0" src="https://www.paypalobjects.com/zh_TW/i/scr/pixel.gif" width="1" height="1">
    </form>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
.donate{
  flex-basis: 40%;
  &>.title{
    color: var(--blue);
    border-bottom: 1px solid var(--blue);
  }
}
</style>