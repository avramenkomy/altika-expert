from django.db import models

class Service(models.Model):
    title = models.CharField('Наименование услуги', max_length=255)
    slug = models.SlugField('Slug', max_length=255, unique=True)

    short_description = models.TextField(
        'Краткое описание',
        blank=True,
    )
    description = models.TextField(
        'Подробное описание',
        blank=True,
    )
    image = models.ImageField(
        'Изображение',
        upload_to='services/',
        blank=True,
        null=True,
    )
    price_from = models.DecimalField(
        'Цена от',
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
    )

    seo_title = models.CharField(
        'Seo title',
        max_length=255,
        blank=True,
    )
    seo_description = models.TextField(
        'Seo description',
        blank=True,
    )

    order = models.PositiveBigIntegerField(
        'Порядок отображения',
        default=0,
    )
    is_active = models.BooleanField(
        'Отображать на сайте',
        default=True
    )

    created_at = models.DateTimeField(
        'Создано',
        auto_now_add=True,
    )
    updated_at = models.DateTimeField(
        'Изменено',
        auto_now=True
    )

    class Meta:
        verbose_name = 'Услуга'
        verbose_name_plural = 'Услуги'
        ordering = ( 'order', 'title', )

    def __str__(self):
        return self.title
