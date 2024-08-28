function formatRupiah(text) {
  return text.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });
}

$(document).ready(function () {
  $("#pengeluaran-bulan").on("input", function () {
    pengeluaranBulanIDR = $(this)
      .val()
      .replace(/[^0-9]/g, "");
    pengeluaranBulan = parseFloat(pengeluaranBulanIDR);

    if (pengeluaranBulan) {
      pengeluaranBulanIDR = formatRupiah(pengeluaranBulan);
      $(this).val(pengeluaranBulanIDR);
      $(this).data("value", pengeluaranBulan);

      pengeluaranTahun = pengeluaranBulan * 12;
      pengeluaranTahunIDR = formatRupiah(pengeluaranTahun);
      $("#add").html("");
      add = `
<label for="pengeluaran-tahun">Pengeluaran / tahun</label> <br>
<input type="text" id="pengeluaran-tahun" name="pengeluaran-tahun" value="${pengeluaranTahunIDR}" readonly /> <br /><br />
<br />
<br />
<div class="pengeluaranNanti"><i class="fa-solid fa-magnifying-glass-dollar" style="color: #ffffff;"></i> Cari tahu pengeluaranmu saat pensiun nanti.</div>
<br />
<label for="usia-sekarang">Usiamu sekarang</label> <br>
<input type="text" id="usia-sekarang" name="usia-sekarang" size="1" style="text-align: center;"/> Tahun <br /><br /> `;
      $("#add").append(add);
    } else {
      $(this).val("");
    }
  });

  $(document).on("input", "#usia-sekarang", function () {
    usiaSekarang = $(this).val();
    if (usiaSekarang && !$("#usia-pensiun").length) {
      add = `
        <label for="usia-pensiun">Kamu ingin pensiun di usia</label> <br>
        <input type="text" id="usia-pensiun" name="usia-pensiun" size="1" style="text-align: center;"/> Tahun <span class="alert hidden">Usia pensiun harus lebih besar dari usiamu sekarang</span> <br /><br />
      `;
      $("#add").append(add);
    }
  });

  $(document).on("input", "#usia-pensiun, #inflasi", function () {
    usiaSekarang = $("#usia-sekarang").val();
    usiaPensiun = $("#usia-pensiun").val();
    inflasi = $("#inflasi").val();

    if (usiaPensiun <= usiaSekarang) {
      $(".alert").removeClass("hidden");
    } else {
      $(".alert").addClass("hidden");
      $(".hasil").show();

      tahunpensiun = usiaPensiun - usiaSekarang;
      $("#label-uang-dibutuhkan").html(`Uang yang kamu butuhkan <span class="highlight">${tahunpensiun} tahun</span> lagi berdasarkan ${inflasi}% rule`);

      inflasi = $("#inflasi").val();
      pengeluaranPensiun = pengeluaranTahun;

      for (i = 0; i < tahunpensiun; i++) {
        pengeluaranPensiun *= 1 + inflasi / 100;
      }

      pengeluaranPensiun = pengeluaranPensiun.toFixed(2);
      pengeluaranPensiunIDR = formatRupiah(parseFloat(pengeluaranPensiun));

      $("#pengeluaran-pensiun").val(pengeluaranPensiunIDR);

      uangDibutuhkan = (pengeluaranPensiun * 25).toFixed(2);
      uangDibutuhkanIDR = formatRupiah(parseFloat(uangDibutuhkan));

      $("#uang-dibutuhkan").val(uangDibutuhkanIDR);
    }
  });
});
