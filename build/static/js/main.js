$(document).ready(function () {
    phoneFormat($(".phone"));
    smoothScrolling();

    ["#question-form_1", "#question-form_2"].forEach(function (id) {
        $(id).submit(function (e) {
            e.preventDefault();

            const form = $(this);

            $.ajax({
                type: "POST",
                url: "/question",
                data: form.serialize(),
                success: function ({ msg, status }) {
                    alert(msg);
                    form.trigger("reset");
                },
            });
        });
    });
});

function phoneFormat(linkPhoneList) {
    $.each(linkPhoneList, function () {
        $(this).text(function () {
            return $(this)
                .text()
                .replace(/(\d\d\d)(\d\d\d)(\d\d)(\d\d)/, "+7 ($1)-$2-$3-$4");
        });
    });
}

function smoothScrolling() {
    // собираем все якоря; устанавливаем время анимации и количество кадров
    const anchors = [].slice.call(document.querySelectorAll('a[href*="#"]')),
        animationTime = 300,
        framesCount = 20;

    anchors.forEach(function (item) {
        // каждому якорю присваиваем обработчик события
        item.addEventListener("click", function (e) {
            // убираем стандартное поведение
            e.preventDefault();

            // для каждого якоря берем соответствующий ему элемент и определяем его координату Y
            let coordY = document.querySelector(item.getAttribute("href")).getBoundingClientRect().top + window.pageYOffset;

            // запускаем интервал, в котором
            let scroller = setInterval(function () {
                // считаем на сколько скроллить за 1 такт
                let scrollBy = coordY / framesCount;

                // если к-во пикселей для скролла за 1 такт больше расстояния до элемента
                // и дно страницы не достигнуто
                if (scrollBy > window.pageYOffset - coordY && window.innerHeight + window.pageYOffset < document.body.scrollHeight) {
                    // то скроллим на к-во пикселей, которое соответствует одному такту
                    window.scrollBy(0, scrollBy);
                } else {
                    // иначе добираемся до элемента и выходим из интервала
                    window.scrollTo(0, coordY);
                    clearInterval(scroller);
                }
                // время интервала равняется частному от времени анимации и к-ва кадров
            }, animationTime / framesCount);
        });
    });
}
