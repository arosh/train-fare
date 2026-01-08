<template>
  <div class="container">
    <h1>JRの割引計算機</h1>
    <div class="form-group">
      <label>運賃（円）</label>
      <input v-model.number="basicFee" type="number" class="form-control" />
    </div>
    <div class="form-group">
      <label>特急料金（円）</label>
      <input v-model.number="expressFee" type="number" class="form-control" />
    </div>
    <div class="checkbox">
      <label>
        <input v-model="buyTwoWayTicket" type="checkbox" />
        往復切符を買う
      </label>
      <ul v-show="buyTwoWayTicket">
        <li>
          <label>
            <input v-model="useTwoWayDiscount" type="checkbox" />
            <span :class="{ 'text-danger': isTwoWayDiscountInvalid }"> 往復割を使う </span>
          </label>
          <ul v-show="useTwoWayDiscount">
            <li>
              <label>
                <input v-model="twoWayDiscountCheck1" type="checkbox" />
                <span :class="{ 'text-danger': !twoWayDiscountCheck1 }">
                  片道601km以上である（東京ー大阪間は不可）
                </span>
              </label>
            </li>
            <li>
              <label>
                <input v-model="twoWayDiscountCheck2" type="checkbox" />
                <span :class="{ 'text-danger': !twoWayDiscountCheck2 }">
                  乗車券の有効日数を超える場合は往復切符を買うことができないことを知っている<br />
                  （<a href="https://www.jreast.co.jp/kippu/04.html"
                    >乗車券の有効期間｜きっぷのルール：JRおでかけネット</a
                  >）
                </span>
              </label>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="checkbox">
      <label>
        <input v-model="useStudentDiscount" type="checkbox" />
        <span :class="{ 'text-danger': isStudentDiscountInvalid }"> 学割を使う </span>
      </label>
      <ul v-show="useStudentDiscount">
        <li>
          <label>
            <input v-model="studentDiscountCheck1" type="checkbox" />
            <span :class="{ 'text-danger': !studentDiscountCheck1 }"> 片道101km以上である </span>
          </label>
        </li>
        <li>
          <label>
            <input v-model="studentDiscountCheck2" type="checkbox" />
            <span :class="{ 'text-danger': !studentDiscountCheck2 }">
              乗車券の有効日数を超える場合は往復切符を買うことができないので，往路と復路で学割証が2枚必要なことを知っている<br />
              （<a href="https://www.jreast.co.jp/kippu/04.html"
                >乗車券の有効期間｜きっぷのルール：JRおでかけネット</a
              >）
            </span>
          </label>
        </li>
        <li>
          <label>
            <input v-model="studentDiscountCheck3" type="checkbox" />
            <span :class="{ 'text-danger': !studentDiscountCheck3 }">
              大都市近郊区間では往復券は発売当日のみ有効で，日が変わる場合には往路と復路で学割証が2枚必要なことを知っている<br />
              （<a href="https://www.jr-odekake.net/railroad/ticket/guide/02b.html#5"
                >大都市近郊区間内のみをご利用になる場合の特例｜きっぷのルール：JRおでかけネット</a
              >）
            </span>
          </label>
        </li>
      </ul>
    </div>
    <div v-show="showWarning" class="alert alert-warning" role="alert">
      チェックボックスを確認してください
    </div>
    <b>結果</b> {{ formula }} = {{ amount }}
  </div>
</template>

<script>
import currencyFormatter from 'currency-formatter';

export default {
  data() {
    return {
      basicFee: 8910,
      expressFee: 5810,
      buyTwoWayTicket: true,
      useTwoWayDiscount: false,
      useStudentDiscount: false,
      twoWayDiscountCheck1: false,
      twoWayDiscountCheck2: false,
      studentDiscountCheck1: false,
      studentDiscountCheck2: false,
      studentDiscountCheck3: false,
    };
  },
  computed: {
    showWarning() {
      return this.isTwoWayDiscountInvalid || this.isStudentDiscountInvalid;
    },
    isTwoWayDiscountInvalid() {
      return this.useTwoWayDiscount && !(this.twoWayDiscountCheck1 && this.twoWayDiscountCheck2);
    },
    isStudentDiscountInvalid() {
      return (
        this.useStudentDiscount &&
        !(this.studentDiscountCheck1 && this.studentDiscountCheck2 && this.studentDiscountCheck3)
      );
    },
    formula() {
      let result = this.basicFee.toString();
      if (this.useTwoWayDiscount) {
        result += ' * 0.9';
      }
      if (this.useStudentDiscount) {
        result += ' * 0.8';
      }
      if (this.expressFee > 0) {
        result += ` + ${this.expressFee.toString()}`;
      }
      result = `floor10(${result})`;
      if (this.buyTwoWayTicket) {
        result += ' * 2';
      }
      return result;
    },
    amount() {
      let result = this.basicFee;
      if (this.useTwoWayDiscount) {
        result *= 0.9;
      }
      if (this.useStudentDiscount) {
        result *= 0.8;
      }
      if (this.expressFee > 0) {
        result += this.expressFee;
      }
      result = this.floor10(result);
      if (this.buyTwoWayTicket) {
        result *= 2;
      }
      return currencyFormatter.format(result, { locale: 'ja-JP' });
    },
  },
  watch: {
    buyTwoWayTicket() {
      if (this.buyTwoWayTicket === false) {
        this.useTwoWayDiscount = false;
      }
    },
    useTwoWayDiscount() {
      if (this.useTwoWayDiscount === false) {
        this.twoWayDiscountCheck1 = false;
        this.twoWayDiscountCheck2 = false;
      }
    },
    useStudentDiscount() {
      if (this.useStudentDiscount === false) {
        this.studentDiscountCheck1 = false;
        this.studentDiscountCheck2 = false;
        this.studentDiscountCheck3 = false;
      }
    },
  },
  methods: {
    floor10(value) {
      return Math.floor(value / 10) * 10;
    },
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
}

ul {
  list-style-type: none;
}
</style>
