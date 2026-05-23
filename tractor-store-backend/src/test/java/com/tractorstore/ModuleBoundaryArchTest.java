package com.tractorstore;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.lang.ArchRule;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

class ModuleBoundaryArchTest {

  private static JavaClasses classes;

  @BeforeAll
  static void importClasses() {
    classes = new ClassFileImporter().importPackages("com.tractorstore");
  }

  @Test
  void internalPackagesAreNotAccessedFromOtherModules() {
    ArchRule rule =
        noClasses()
            .that()
            .resideOutsideOfPackage("..catalog..")
            .should()
            .dependOnClassesThat()
            .resideInAPackage("..catalog.internal..");
    rule.check(classes);

    noClasses()
        .that()
        .resideOutsideOfPackage("..inventory..")
        .should()
        .dependOnClassesThat()
        .resideInAPackage("..inventory.internal..")
        .check(classes);

    noClasses()
        .that()
        .resideOutsideOfPackage("..cart..")
        .should()
        .dependOnClassesThat()
        .resideInAPackage("..cart.internal..")
        .check(classes);

    noClasses()
        .that()
        .resideOutsideOfPackage("..order..")
        .should()
        .dependOnClassesThat()
        .resideInAPackage("..order.internal..")
        .check(classes);

    noClasses()
        .that()
        .resideOutsideOfPackage("..notifications..")
        .should()
        .dependOnClassesThat()
        .resideInAPackage("..notifications.internal..")
        .check(classes);
  }

  @Test
  void controllersDoNotAccessRepositoriesDirectly() {
    ArchRule rule =
        noClasses()
            .that()
            .resideInAPackage("..api..")
            .and()
            .haveSimpleNameEndingWith("Controller")
            .should()
            .dependOnClassesThat()
            .resideInAPackage("..repository..");
    rule.check(classes);
  }
}
