import {Component, inject, OnInit} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ArticlesService} from "../../shared/services/articles.service";
import {ArticleType} from "../../../types/article.type";
import {environment} from "../../../environments/environment.development";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RequestsService} from "../../shared/services/requests.service";
import {RequestType} from "../../../types/request.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {HotToastService} from "@ngneat/hot-toast";
import {ModalDataType} from "../../../types/modal-data.type";


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  private articlesService = inject(ArticlesService);
  private fb = inject(FormBuilder);
  private requestService = inject(RequestsService);
  private hotToastService = inject(HotToastService);

  requestForm: FormGroup;
  showModal: boolean = false;
  modalType: string = '';
  modalData: ModalDataType = {title: '', button: '', form: undefined, selectedService: undefined};
  selectedService: string | undefined;
  articles: ArticleType[] = [];
  serverStaticPath = environment.serverStaticPath;

  banners: { image: string, type: string, titleParts: { title: string; isSpan?: boolean }[], text?: string, service: string }[] = [
    {
      image: '1.png',
      type: 'Предложение месяца',
      titleParts: [
        {title: 'Продвижение в Instagram для вашего бизнеса'},
        {title: ' -15%!', isSpan: true}
      ],
      service: 'Продвижение'

    },
    {
      image: '2.png',
      type: 'Акция',
      titleParts: [
        {title: 'Нужен грамотный '},
        {title: 'копирайтер?', isSpan: true}
      ],
      text: 'Весь декабрь у нас действует акция на работу копирайтера.',
      service: 'Копирайтинг'
    },
    {
      image: '3.png',
      type: 'Новость дня',
      titleParts: [
        {title: '6 место ', isSpan: true},
        {title: 'в ТОП-10 SMM-агенств Москвы!'}
      ],
      text: 'Мы благодарим каждого, кто голосовал за нас!',
      service: 'Продвижение'
    }
  ]
  services: { image: string, title: string, description: string, price: string }[] = [
    {
      image: '1.png',
      title: 'Создание сайтов',
      description: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: '7 500'
    },
    {
      image: '2.png',
      title: 'Продвижение',
      description: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      price: '3 500'
    },
    {
      image: '3.png',
      title: 'Реклама',
      description: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      price: '1 000'
    },
    {
      image: '4.png',
      title: 'Копирайтинг',
      description: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      price: '750'
    },

  ]
  benefits: { number: number, benefit: string, text: string }[] = [
    {
      number: 1,
      benefit: 'Мастерски вовлекаем аудиториюв процесс.',
      text: 'Мы увеличиваем процент вовлечённости за короткий промежуток времени.'
    },
    {
      number: 2,
      benefit: 'Разрабатываем бомбическую визуальную концепцию.',
      text: 'Наши специалисты знают как создать уникальный образ вашего проекта.'
    },
    {
      number: 3,
      benefit: 'Создаём мощные воронки с помощью текстов.',
      text: 'Наши копирайтеры создают не только вкусные текста, но и классные воронки.'
    },
    {
      number: 4,
      benefit: 'Помогаем продавать больше.',
      text: ' Мы не только помогаем разработать стратегию по продажам, но также корректируем её под нужды заказчика.'
    }
  ]
  reviews: { image: string, name: string, text: string }[] = [
    {
      image: '1.png',
      name: 'Станислав',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    },
    {
      image: '2.png',
      name: 'Алёна',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      image: '3.png',
      name: 'Мария',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    },
    {
      image: '4.jpg',
      name: 'Илья',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    },
    {
      image: '5.jpg',
      name: 'Ирина',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      image: '6.jpg',
      name: 'Анастасия',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    },

  ]

  customOptionsBanners: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    autoplay: true,
    autoplaySpeed: 1500,
    dots: true,
    dotsSpeed: 1000,
    navSpeed: 1000,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      }
    },
    nav: false
  }
  customOptionsReviews: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 25,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      }
    },
  }

  constructor() {
    this.requestForm = this.fb.group({
      service: [this.modalData.selectedService, [Validators.required]],
      name: ['', [Validators.required, Validators.pattern(/^[А-Яа-я\s]*$/)]],
      phone: ['', Validators.required],
      type: ['order']
    });
  }


  ngOnInit() {
    this.articlesService.getTopArticles()
      .subscribe((data: ArticleType[]) => {
        this.articles = data;
      })
  }

  openModal(type: string, selectedService?: string) {
    if (selectedService) {
      this.requestForm.patchValue({
        service: selectedService,
      })
    }
    this.modalType = type;
    this.showModal = true;

    switch (type) {
      case 'request':
        this.modalData = {
          title: 'Заявка на услугу',
          form: this.requestForm,
          button: 'Оставить заявку',
          selectedService: selectedService
        };

        break;
      case 'thanks':
        this.modalData = {
          title: 'Спасибо за вашу заявку!',
          description: 'Мы свяжемся с вами при первой же возможности.',
          button: 'Ок',
          selectedService: undefined
        };
        break;
      default:
        this.showModal = false;
        break;
    }
  }

  createRequest() {

    if (this.requestForm.valid && this.requestForm.value.name && this.requestForm.value.phone && this.requestForm.value.service) {
      const requestParams: RequestType = {
        name: this.requestForm.value.name,
        phone: this.requestForm.value.phone,
        service: this.requestForm.value.service,
        type: 'order',
      };

      this.requestService.createRequest(requestParams)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if (data.error) {
              this.hotToastService.error(data.message);
            }

            this.showModal = false;
            this.requestForm.reset();
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.message) {
              console.log(errorResponse.message);
              this.hotToastService.error('Произошла ошибка при отправке формы, попробуйте еще раз.');
            } else {
              this.hotToastService.error('Ошибка при оформлении заказа!');
            }
          }
        });
    } else {
      this.requestForm.markAllAsTouched();
      this.hotToastService.warning('Необходимо заполнить все поля!');
    }
  }


  closeModal() {
    this.showModal = false;
  }

  formSubmitted() {
    this.showModal = false; //
    setTimeout(() => {
      this.openModal('thanks');
    }, 200);
  }
}
