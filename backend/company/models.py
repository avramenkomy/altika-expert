from django.db import models

class Company(models.Model):
    name = models.CharField('Наименование компании', max_length=255)
    short_name = models.CharField(
        'Краткое наименование',
        max_length=150,
        blank=True
    )

    description = models.TextField('Описание компании')

    inn = models.CharField('ИНН', max_length=12, blank=True)
    kpp = models.CharField('КПП', max_length=9, blank=True)
    ogrn = models.CharField('ОГРН', max_length=15, blank=True)

    logo = models.ImageField(
        'Логотип',
        upload_to='company/logo',
        blank=True,
        null=True,
    )

    phone = models.CharField('Телефон', max_length=50, blank=True)
    phone_secondary = models.CharField(
        'Дополнительный телефон',
        max_length=50,
        blank=True
    )
    email = models.EmailField('Email', blank=True)

    telegram = models.URLField('Telegram', blank=True)
    whatsapp = models.URLField('WhatsApp', blank=True)

    address = models.CharField('Адрес', max_length=255, blank=True)
    working_hours = models.CharField(
        'Часы работы',
        max_length=255,
        blank=True,
    )

    latitude = models.DecimalField(
        'Широта',
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
    )
    longitude = models.DecimalField(
        'Долгота',
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(
        'Создано',
        auto_now_add=True,
    )
    updated_at = models.DateTimeField(
        'Обновлено',
        auto_now=True,
    )

    class Meta:
        verbose_name = 'Компания'
        verbose_name_plural = 'Компания'

    def __str__(self):
        return self.short_name or self.name


class Expertise(models.Model):
    title = models.CharField(
        'Наименование вида экспертизы',
        max_length=255,
    )
    slug = models.SlugField('Slug', max_length=255, unique=True)

    short_description = models.TextField(
        'Краткой описание',
        blank=True,
    )
    description = models.TextField(
        'Полное описание',
        blank=True,
    )

    image = models.ImageField(
        'Изображение',
        upload_to='expertises/',
        blank=True,
        null=True
    )

    seo_title = models.CharField(
        'SEO Title',
        max_length=255,
        blank=True,
    )
    seo_description = models.TextField(
        'SEO description',
        blank=True,
    )

    order = models.PositiveBigIntegerField(
        'Порядок отображения',
        default=0,
    )
    is_active = models.BooleanField(
        'Отображать на сайте',
        default=True,
    )

    created_at = models.DateTimeField(
        'Создано',
        auto_now_add=True,
    )
    updated_at = models.DateTimeField(
        'Обновлено',
        auto_now=True
    )

    class Meta:
        verbose_name = 'Вид экспертизы'
        verbose_name_plural = 'Виды экспертиз'
        ordering=('order', 'title', )

    def __str__(self):
        return self.title


class ValuationType(models.Model):
    title = models.CharField(
        'Наименование вида оценки',
        max_length=255
    )
    slug = models.SlugField('Slug', max_length=255, unique=True)

    short_description = models.TextField(
        'Краткой описание',
        blank=True,
    )
    description = models.TextField(
        'Полное описание',
        blank=True,
    )

    image = models.ImageField(
        'Изображение',
        upload_to='valuation/',
        blank=True,
        null=True
    )

    price_from = models.DecimalField(
        'Цена от',
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
    )

    seo_title = models.CharField(
        'SEO Title',
        max_length=255,
        blank=True,
    )
    seo_description = models.TextField(
        'SEO description',
        blank=True,
    )

    order = models.PositiveBigIntegerField(
        'Порядок отображения',
        default=0,
    )
    is_active = models.BooleanField(
        'Отображать на сайте',
        default=True,
    )

    created_at = models.DateTimeField(
        'Создано',
        auto_now_add=True,
    )
    updated_at = models.DateTimeField(
        'Обновлено',
        auto_now=True
    )

    class Meta:
        verbose_name = 'Вид оценки'
        verbose_name_plural = 'Виды оценки'
        ordering=('order', 'title', )

    def __str__(self):
        return self.title


# Модель для раздела сайта "Этапы проведения экспертизы"
class ProcessStep(models.Model):
    class ProcessType(models.TextChoices):
        EXPERTISE = 'expertise', 'Судебная экспертиза'
        VALUATION = 'valuation', 'Оценочные услуги'

    process_type = models.CharField(
        'Процесс',
        max_length=20,
        choices=ProcessType.choices
    )

    title = models.CharField('Наименование этапа', max_length=255)

    description = models.TextField(
        'Описание этапа',
        blank=True,
    )

    order = models.PositiveBigIntegerField(
        'Порядок отображения',
        default=0
    )

    is_active = models.BooleanField(
        'Отображать на сайте',
        default=True
    )

    class Meta:
        verbose_name = 'Этапы работы'
        verbose_name_plural = 'Этапы работы'
        ordering = ( 'process_type', 'order', )

    def __str__(self):
        return self.title


# Модель для раздела сайта "Судебная экспертиза и оценка необходима в следующих ситуациях"
class UseCase(models.Model):
    class CaseType(models.TextChoices):
        EXPERTISE = 'expertise', 'Экспертиза'
        VALUATION = 'valuation', 'Оценка'
        BOTH = 'both', 'Экспертиза и оценка'

    case_type = models.CharField(
        'Направление',
        max_length=20,
        choices=CaseType.choices,
        default=CaseType.BOTH,
    )

    title = models.CharField('Наименование', max_length=255)

    description = models.TextField('Описание', blank=True)

    order = models.PositiveBigIntegerField(
        'Порядок отображения',
        default=0
    )

    is_active = models.BooleanField(
        'Отображать на сайте',
        default=True,
    )

    class Meta:
        verbose_name = 'Случай обращения'
        verbose_name_plural = 'Когда необходима экспертиза или оценка'
        ordering = ('order', 'title')

    def __str__(self):
        return self.title


# Модель для раздела сайта "документы компании"
class CompanyDocument(models.Model):
    title = models.CharField('Наименование документа', max_length=255)
    description = models.TextField('Описание документа', blank=True)
    image = models.ImageField(
        'Изображение документа',
        upload_to='company/documents/',
        blank=True,
        null=True,
    )

    file = models.FileField(
        'Файл',
        upload_to='company/documents/files',
        blank=True,
        null=True,
    )

    order = models.PositiveBigIntegerField(
        'Порядок отображения',
        default=0
    )

    is_active = models.BooleanField(
        'Отображать на сайте',
        default=True,
    )

    class Meta:
        verbose_name = 'Документ компании'
        verbose_name_plural = 'Документы компании'
        ordering = ('order', 'title')

    def __str__(self):
        return self.title

class SiteSettings(models.Model):
    show_documents_page = models.BooleanField(
        'Показывать раздел документов',
        default=True,
    )

    hero_title = models.CharField(
        'Заголовок первого экрана',
        max_length=500,
        blank=True,
    )

    hero_subtitle = models.CharField(
        'Подзаголовок первого экрана',
        max_length=500,
        blank=True,
    )

    hero_image = models.ImageField(
        'Фоновое изображение первого экрана',
        upload_to='site/hero/',
        blank=True,
        null=True,
    )

    class Meta:
        verbose_name = 'Настройки сайта'
        verbose_name_plural = 'Настройки сайта'

    def __str__(self):
        return 'Настройки сайта'


# Модель для раздела сайта "О компании"
class CompanyAdvantage(models.Model):
    title = models.CharField('Название', max_length=150)
    description = models.TextField('Описание', blank=True)
    order = models.PositiveBigIntegerField('Порядок отображения', default=0)
    is_active = models.BooleanField('Отображать на сайте', default=True)

    class Meta:
        verbose_name = 'Преимущество компании'
        verbose_name_plural = 'Преимущества компании'
        ordering = ( 'order', 'title', )

    def __str__(self):
        return self.title